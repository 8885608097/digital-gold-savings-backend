const SavingsPlan = require("../models/SavingsPlan");
const Wallet = require("../models/Wallet");
const { getGoldRate } = require("../services/goldService");

// ⭐ Add Audit Logger
const { logAction } = require("../utils/auditLogger");


// -----------------------------------------
// CREATE SAVINGS PLAN
// -----------------------------------------
exports.createPlan = async (req, res) => {
  try {
    const { planName, amountINR, durationMonths } = req.body;

    if (!planName || !amountINR || !durationMonths) {
      return res.status(400).json({ success: false, msg: "Missing fields" });
    }

    const nextDebit = new Date();
    nextDebit.setMonth(nextDebit.getMonth() + 1);

    const plan = await SavingsPlan.create({
      userId: req.user.id,
      planName,
      amountINR,
      durationMonths,
      nextDebitDate: nextDebit,
    });

    // ⭐ AUDIT LOG
    logAction(req, "SAVINGS_PLAN_CREATED", plan);

    res.json({ success: true, msg: "Savings plan created", plan });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



// -----------------------------------------
// GET ALL SAVINGS PLANS FOR LOGGED USER
// -----------------------------------------
exports.getMyPlans = async (req, res) => {
  try {
    const plans = await SavingsPlan.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



// -----------------------------------------
// PAUSE PLAN
// -----------------------------------------
exports.pausePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await SavingsPlan.findOneAndUpdate(
      { _id: planId, userId: req.user.id },
      { status: "PAUSED" },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ success: false, msg: "Plan not found" });
    }

    // ⭐ AUDIT LOG
    logAction(req, "SAVINGS_PLAN_PAUSED", { planId });

    res.json({ success: true, msg: "Plan paused", plan });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



// -----------------------------------------
// RESUME PLAN
// -----------------------------------------
exports.resumePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await SavingsPlan.findOneAndUpdate(
      { _id: planId, userId: req.user.id },
      { status: "ACTIVE" },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ success: false, msg: "Plan not found" });
    }

    // ⭐ AUDIT LOG
    logAction(req, "SAVINGS_PLAN_RESUMED", { planId });

    res.json({ success: true, msg: "Plan resumed", plan });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
