const cron = require("node-cron");
const SavingsPlan = require("../models/SavingsPlan");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const { getGoldRate } = require("../services/goldService");
const User = require("../models/User");

// Email imports
const { sendEmail } = require("../utils/emailService");
const templates = require("../utils/emailTemplates");

// Audit Logger
const { logAction } = require("../utils/auditLogger");

console.log("⏳ Auto-debit job initialized...");

// Run every hour
cron.schedule("0 * * * *", async () => {
  console.log("⏳ Auto-debit job running...");

  try {
    const today = new Date();

    const duePlans = await SavingsPlan.find({
      status: "ACTIVE",
      nextDebitDate: { $lte: today }
    });

    for (const plan of duePlans) {
      const wallet = await Wallet.findOne({ userId: plan.userId });
      const user = await User.findById(plan.userId);

      if (!user) continue;

      // ❌ If insufficient balance → FAILED EMAIL
      if (!wallet || wallet.balanceINR < plan.amountINR) {
        console.log(`❌ EMI Failed for user ${user.email}`);

        sendEmail(
          user.email,
          "Savings EMI Failed",
          templates.savingsEMIFailed(user.name, plan.amountINR)
        );

        // 🔴 Log failed EMI
        logAction(
          { user: { id: plan.userId }, ip: "cron-job", headers: {} },
          "SAVINGS_EMI_FAILED",
          { amountINR: plan.amountINR, planId: plan._id }
        );

        continue;
      }

      // Fetch gold rate
      const rate = await getGoldRate();
      const grams = plan.amountINR / rate.ratePerGram;

      // Deduct balance and add gold
      wallet.balanceINR -= plan.amountINR;
      wallet.goldGrams += grams;
      await wallet.save();

      // Create transaction
      await Transaction.create({
        userId: plan.userId,
        type: "savings_emi",
        amountINR: plan.amountINR,
        goldGrams: grams,
        goldRateAtTxn: rate.ratePerGram,
        status: "success"
      });

      // Update savings plan
      plan.monthsCompleted += 1;
      plan.totalGoldAccumulated += grams;

      const nextDate = new Date(today);
      nextDate.setMonth(nextDate.getMonth() + 1);
      plan.nextDebitDate = nextDate;

      await plan.save();

      // 🟢 EMI Success Email
      sendEmail(
        user.email,
        "Savings EMI Success",
        templates.savingsEMISuccess(user.name, plan.amountINR)
      );

      // 🟢 Audit Log for successful EMI
      logAction(
        { user: { id: plan.userId }, ip: "cron-job", headers: {} },
        "SAVINGS_EMI_DEBITED",
        { amountINR: plan.amountINR, planId: plan._id }
      );

      console.log(`✅ EMI Success for user ${user.email}`);
    }
  } catch (err) {
    console.error("Auto-debit error:", err.message);
  }
});
