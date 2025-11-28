const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const {
  getAllUsers,
  makeAdmin,
  getAllWallets,
  getAllTransactions,
  getAllKYC,
  approveKYC,
  rejectKYC,
  getAllSavingsPlans,
} = require("../controllers/adminController");

// Users
router.get("/users", auth, admin, getAllUsers);
router.post("/users/:userId/make-admin", auth, admin, makeAdmin);

// Wallets
router.get("/wallets", auth, admin, getAllWallets);

// Transactions
router.get("/transactions", auth, admin, getAllTransactions);

// KYC
router.get("/kyc", auth, admin, getAllKYC);
router.post("/kyc/:kycId/approve", auth, admin, approveKYC);
router.post("/kyc/:kycId/reject", auth, admin, rejectKYC);

// Savings plans
router.get("/savings", auth, admin, getAllSavingsPlans);

module.exports = router;
