const mongoose = require("mongoose");

const SavingsPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  planName: { type: String, required: true },
  amountINR: { type: Number, required: true },  // EMI amount
  durationMonths: { type: Number, required: true }, // 6, 12, etc.

  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "monthly",
  },

  status: {
    type: String,
    enum: ["ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"],
    default: "ACTIVE",
  },

  nextDebitDate: { type: Date, required: true },

  // Auto-debit tracking
  emiPaidCount: { type: Number, default: 0 },
  goldAccumulated: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SavingsPlan", SavingsPlanSchema);
