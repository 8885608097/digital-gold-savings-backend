const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getInvoice } = require("../controllers/invoiceController");

// GET Invoice PDF
router.get("/:txnId", auth, getInvoice);

module.exports = router;
