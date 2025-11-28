const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const { getGoldRate } = require("../services/goldService");

// Email
const { sendEmail } = require("../utils/emailService");
const templates = require("../utils/emailTemplates");

// Audit Log
const { logAction } = require("../utils/auditLogger");

exports.sellGold = async (req, res) => {
  try {
    const { grams } = req.body;

    if (!grams || grams <= 0) {
      return res.status(400).json({
        success: false,
        msg: "Invalid gold amount",
      });
    }

    // 1️⃣ Fetch wallet
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(400).json({
        success: false,
        msg: "Wallet not found",
      });
    }

    // 2️⃣ Check gold balance
    if (wallet.goldGrams < grams) {
      return res.status(400).json({
        success: false,
        msg: "Insufficient gold balance",
      });
    }

    // 3️⃣ Fetch latest gold rate
    const rateData = await getGoldRate();
    const ratePerGram = rateData.ratePerGram;

    // 4️⃣ Convert grams → INR
    const amountINR = grams * ratePerGram;

    // 5️⃣ Create transaction
    const transaction = await Transaction.create({
      userId: req.user.id,
      type: "sell_gold",
      amountINR,
      goldGrams: grams,
      goldRateAtTxn: ratePerGram,
      status: "pending",
      createdAt: new Date(),
    });

    // 6️⃣ Update wallet
    wallet.goldGrams -= grams;
    wallet.balanceINR += amountINR;
    await wallet.save();

    // 7️⃣ Mark transaction success
    transaction.status = "success";
    await transaction.save();

    // 8️⃣ Email user
    const user = await User.findById(req.user.id);
    if (user) {
      sendEmail(
        user.email,
        "Gold Sell Successful",
        templates.goldSell(user.name, grams.toFixed(3), amountINR)
      );
    }

    // 9️⃣ Audit Log
    logAction(req, "SELL_GOLD", {
      grams,
      amountINR,
      ratePerGram
    });

    return res.json({
      success: true,
      msg: "Gold sold successfully",
      data: {
        transactionId: transaction._id,
        gramsSold: grams,
        ratePerGram,
        amountCreditedINR: amountINR,
        newBalanceINR: wallet.balanceINR,
        remainingGold: wallet.goldGrams,
      },
    });
  } catch (err) {
    console.error("Sell Gold Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
