const Transaction = require("../models/Transaction");


// ---------------------------------------------------
// GET ALL TRANSACTIONS (with filters + pagination)
// ---------------------------------------------------
exports.getTransactions = async (req, res) => {
  try {
    const { type, fromDate, toDate, page = 1, limit = 10 } = req.query;

    const filters = { userId: req.user.id };

    if (type) filters.type = type;

    if (fromDate || toDate) {
      filters.createdAt = {};
      if (fromDate) filters.createdAt.$gte = new Date(fromDate);
      if (toDate) filters.createdAt.$lte = new Date(toDate);
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(filters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Transaction.countDocuments(filters),
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: transactions,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// ---------------------------------------------------
// GET ONE TRANSACTION
// ---------------------------------------------------
exports.getTransactionById = async (req, res) => {
  try {
    const txn = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!txn) {
      return res.status(404).json({ success: false, msg: "Transaction not found" });
    }

    res.json({ success: true, data: txn });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// ---------------------------------------------------
// STATEMENT SUMMARY (INR & GOLD)
// ---------------------------------------------------
exports.getStatementSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const txns = await Transaction.find({ userId });

    const summary = {
      totalINRIn: 0,
      totalINROut: 0,
      totalGoldIn: 0,
      totalGoldOut: 0,
    };

    txns.forEach(t => {
      if (t.type === "add_funds") summary.totalINRIn += t.amountINR;
      if (t.type === "withdraw_funds") summary.totalINROut += t.amountINR;

      if (t.type === "buy_gold") summary.totalGoldIn += t.goldGrams;
      if (t.type === "sell_gold") summary.totalGoldOut += t.goldGrams;

      if (t.type === "savings_emi") summary.totalGoldIn += t.goldGrams;
    });

    res.json({ success: true, summary });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// ---------------------------------------------------
// MONTHLY STATEMENT
// ---------------------------------------------------
exports.getMonthlyStatement = async (req, res) => {
  try {
    const { month, year } = req.query; // month: 1-12

    if (!month || !year) {
      return res.status(400).json({ success: false, msg: "Month and year required" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const txns = await Transaction.find({
      userId: req.user.id,
      createdAt: { $gte: start, $lt: end },
    }).sort({ createdAt: -1 });

    res.json({ success: true, month, year, transactions: txns });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
