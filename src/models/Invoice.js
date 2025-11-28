const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  type: { type: String, enum:['purchase','sell','savings_certificate'] },
  fileUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
