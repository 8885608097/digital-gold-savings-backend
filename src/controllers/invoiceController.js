const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { generateInvoice } = require("../utils/invoiceGenerator");

// email service
const { sendEmail } = require("../utils/emailService");

exports.getInvoice = async (req, res) => {
  try {
    const { txnId } = req.params;

    const txn = await Transaction.findById(txnId);
    if (!txn) {
      return res.status(404).json({ success: false, msg: "Transaction not found" });
    }

    // Ensure user owns the transaction
    if (txn.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, msg: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);

    // 📌 1. Generate PDF
    const pdfPath = await generateInvoice(txn, user);

    // 📌 2. Email Invoice as Attachment
    await sendEmail(
      user.email,
      "Your Gold Invoice",
      `<p>Hi ${user.name},</p><p>Your invoice is attached.</p>`,
      [
        {
          filename: "invoice.pdf",
          path: pdfPath,
        },
      ]
    );

    console.log("📧 Invoice emailed to:", user.email);

    // 📌 3. Also allow user to download via API
    return res.download(pdfPath);

  } catch (err) {
    console.log("Invoice error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
