const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // INR balance for buying/selling gold
    balanceINR: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Total gold holdings (in grams)
    goldGrams: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Reserved for pending transactions (optional)
    reservedGoldGrams: {
      type: Number,
      default: 0,
      min: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
