const Wallet = require("../models/Wallet");

// Create wallet automatically if not found
async function createWalletIfNotExists(userId) {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balanceINR: 0,
      goldGrams: 0,
      reservedGoldGrams: 0,
    });
  }
  return wallet;
}

/**
 * GET WALLET DETAILS
 */
exports.getWallet = async (req, res) => {
  try {
    const wallet = await createWalletIfNotExists(req.user.id);
    res.json({ success: true, wallet });
  } catch (err) {
    console.error("Wallet fetch error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * ADD FUNDS (Simplified - without Payment Gateway yet)
 */
exports.addFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, msg: "Invalid amount" });
    }

    const wallet = await createWalletIfNotExists(req.user.id);

    wallet.balanceINR += amount;
    await wallet.save();

    res.json({
      success: true,
      msg: "Wallet funded successfully",
      newBalance: wallet.balanceINR,
    });
  } catch (err) {
    console.error("Add funds error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * WITHDRAW FUNDS (Simple logic)
 * Real apps require admin approval or payment gateway payouts!
 */
exports.withdrawFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, msg: "Invalid amount" });
    }

    const wallet = await createWalletIfNotExists(req.user.id);

    if (wallet.balanceINR < amount) {
      return res.status(400).json({ success: false, msg: "Insufficient balance" });
    }

    wallet.balanceINR -= amount;
    await wallet.save();

    res.json({
      success: true,
      msg: "Withdrawal request submitted",
      remainingBalance: wallet.balanceINR,
    });
  } catch (err) {
    console.error("Withdraw error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
