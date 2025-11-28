const SavingsPlan = require("../models/SavingsPlan");
const Wallet = require("../models/Wallet");
const { getGoldRate } = require("../services/goldService");

async function processSavingsPlans() {
  const today = new Date();

  const plans = await SavingsPlan.find({
    status: "ACTIVE",
    nextDebitDate: { $lte: today },
  });

  for (const plan of plans) {
    const wallet = await Wallet.findOne({ userId: plan.userId });

    if (!wallet || wallet.balanceINR < plan.amountINR) {
      console.log("Insufficient balance for plan:", plan._id);
      continue;
    }

    const rate = await getGoldRate();
    const grams = plan.amountINR / rate.ratePerGram;

    wallet.balanceINR -= plan.amountINR;
    wallet.goldGrams += grams;
    await wallet.save();

    plan.totalGoldAccumulated += grams;
    plan.monthsCompleted += 1;

    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    plan.nextDebitDate = next;

    if (plan.monthsCompleted >= plan.durationMonths) {
      plan.status = "COMPLETED";
    }

    await plan.save();

    console.log("Savings Plan Executed:", plan._id);
  }
}

module.exports = processSavingsPlans;
