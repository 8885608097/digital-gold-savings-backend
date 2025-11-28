const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { getGoldRate } = require("../services/goldService");
const { sendEmail } = require("../utils/emailService");
const templates = require("../utils/emailTemplates");
const { logAction } = require("../utils/auditLogger");

exports.buyGold = async (req, res) => {
  try {
    const { amountINR } = req.body;

    if (!amountINR || amountINR <= 0) {
      return res.status(400).json({ success: false, msg: "Invalid purchase amount" });
    }

    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) wallet = await Wallet.create({ userId: req.user.id });

    if (wallet.balanceINR < amountINR) {
      return res.status(400).json({ success: false, msg: "Insufficient INR balance" });
    }

    const rateData = await getGoldRate();
    const ratePerGram = Number(rateData.ratePerGram || rateData.pricePerGram);

    if (!ratePerGram || isNaN(ratePerGram)) {
      return res.status(500).json({ success: false, msg: "Gold rate not available" });
    }

    const grams = amountINR / ratePerGram;

    if (!grams || grams <= 0 || isNaN(grams)) {
      return res.status(400).json({ success: false, msg: "Failed to calculate gold amount" });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type: "buy_gold",
      amountINR,
      goldGrams: grams,
      goldRateAtTxn: ratePerGram,
      status: "pending",
      createdAt: new Date(),
    });

    // Update wallet
    wallet.balanceINR -= amountINR;
    wallet.goldGrams += grams;
    await wallet.save();

    // Update transaction
    transaction.status = "success";
    await transaction.save();

    // EMAIL FIX — send as string ALWAYS
    const user = await User.findById(req.user.id);
    if (user) {
      const gramsText = grams.toFixed(3); // safe here
      sendEmail(
        user.email,
        "Gold Purchase Successful",
        templates.goldPurchase(
          user.name,
          gramsText,
          amountINR
        )
      );
    }

    // Audit Log
    logAction(req, "BUY_GOLD", {
      amountINR,
      grams,
      ratePerGram
    });

    return res.json({
      success: true,
      msg: "Gold purchased successfully",
      data: {
        transactionId: transaction._id,
        gramsBought: grams,
        ratePerGram,
        newBalanceINR: wallet.balanceINR,
        totalGoldGrams: wallet.goldGrams,
      },
    });

  } catch (err) {
    console.error("Buy Gold Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
