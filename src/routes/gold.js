const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { buyGold } = require("../controllers/buyGoldController");
const { sellGold } = require("../controllers/sellGoldController");
const { getGoldRate } = require("../services/goldService");

// Get latest gold rate
router.get("/rate", auth, async (req, res) => {
  try {
    const rate = await getGoldRate();
    res.json({
      success: true,
      ratePerGram: rate.ratePerGram,
      timestamp: rate.timestamp,
      source: rate.source,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Buy gold
router.post("/buy", auth, buyGold);

// Sell gold
router.post("/sell", auth, sellGold);

module.exports = router;
