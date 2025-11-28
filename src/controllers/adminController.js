const User = require("../models/User");
const KYC = require("../models/KYC");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const SavingsPlan = require("../models/SavingsPlan");


// -------------------------------------------------------------
// GET ALL USERS
// -------------------------------------------------------------
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-passwordHash");
  res.json({ success: true, count: users.length, users });
};


// -------------------------------------------------------------
// MAKE USER ADMIN
// -------------------------------------------------------------
exports.makeAdmin = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, msg: "User not found" });
  }

  res.json({
    success: true,
    msg: "User promoted to admin",
    user
  });
};

// -------------------------------------------------------------
// GET ALL WALLETS
// -------------------------------------------------------------
exports.getAllWallets = async (req, res) => {
  const wallets = await Wallet.find().populate("userId", "name email");
  res.json({ success: true, count: wallets.length, wallets });
};


// -------------------------------------------------------------
// GET ALL TRANSACTIONS
// -------------------------------------------------------------
exports.getAllTransactions = async (req, res) => {
  const txns = await Transaction.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email");

  res.json({ success: true, count: txns.length, transactions: txns });
};


// -------------------------------------------------------------
// GET ALL KYC SUBMISSIONS
// -------------------------------------------------------------
exports.getAllKYC = async (req, res) => {
  const kycs = await KYC.find().populate("userId", "name email");
  res.json({ success: true, count: kycs.length, kycs });
};


// -------------------------------------------------------------
// APPROVE KYC
// -------------------------------------------------------------
exports.approveKYC = async (req, res) => {
  const { kycId } = req.params;

  const kyc = await KYC.findByIdAndUpdate(
    kycId,
    { status: "APPROVED", adminRemark: "Verified" },
    { new: true }
  );

  res.json({ success: true, msg: "KYC Approved", kyc });
};


// -------------------------------------------------------------
// REJECT KYC
// -------------------------------------------------------------
exports.rejectKYC = async (req, res) => {
  const { kycId } = req.params;
  const { remark } = req.body;

  const kyc = await KYC.findByIdAndUpdate(
    kycId,
    { status: "REJECTED", adminRemark: remark },
    { new: true }
  );

  res.json({ success: true, msg: "KYC Rejected", kyc });
};


// -------------------------------------------------------------
// VIEW ALL SAVINGS PLANS
// -------------------------------------------------------------
exports.getAllSavingsPlans = async (req, res) => {
  const plans = await SavingsPlan.find().populate("userId", "name email");
  res.json({ success: true, count: plans.length, plans });
};
