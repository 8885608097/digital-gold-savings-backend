const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  type: {
    type: String,
    enum: ["buy_gold", "sell_gold", "add_funds", "withdraw_funds", "savings_emi"],
    required: true,
  },

  amountINR: { type: Number, default: 0 },
  goldGrams: { type: Number, default: 0 },
  goldRateAtTxn: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "success",
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
