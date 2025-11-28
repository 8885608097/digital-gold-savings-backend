const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const {
  getWallet,
  addFunds,
  withdrawFunds,
} = require("../controllers/walletController");

// Get wallet details
router.get("/", auth, getWallet);

// Add funds
router.post("/add", auth, addFunds);

// Withdraw funds
router.post("/withdraw", auth, withdrawFunds);

module.exports = router;
