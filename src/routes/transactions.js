const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getTransactions,
  getTransactionById,
  getStatementSummary,
  getMonthlyStatement
} = require("../controllers/transactionController");

router.get("/", auth, getTransactions);
router.get("/summary", auth, getStatementSummary);
router.get("/monthly", auth, getMonthlyStatement);
router.get("/:id", auth, getTransactionById);

module.exports = router;
