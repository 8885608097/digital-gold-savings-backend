const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

function generateInvoice(transaction, user) {
  return new Promise((resolve, reject) => {
    const invoiceId = `INV-${Date.now()}`;
    const filePath = path.join(__dirname, "..", "invoices", `${invoiceId}.pdf`);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header
    doc.fontSize(20).text("Digital Gold Purchase Invoice", { align: "center" });
    doc.moveDown();

    // User Details
    doc.fontSize(12).text(`Invoice ID: ${invoiceId}`);
    doc.text(`Customer Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.moveDown();

    // Transaction Details
    doc.fontSize(14).text("Transaction Details", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`Transaction ID: ${transaction._id}`);
    doc.text(`Type: ${transaction.type}`);
    doc.text(`Amount (INR): ₹${transaction.amountINR}`);
    doc.text(`Gold Bought: ${transaction.goldGrams.toFixed(4)} grams`);
    doc.text(`Gold Rate: ₹${transaction.goldRateAtTxn}/gram`);
    doc.text(`Status: ${transaction.status}`);
    doc.moveDown();

    // Footer
    doc.fontSize(10).text("Thank you for using Digital Gold Savings App!", {
      align: "center",
      opacity: 0.7,
    });

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}

module.exports = { generateInvoice };
