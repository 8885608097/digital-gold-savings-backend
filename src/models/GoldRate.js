const mongoose = require('mongoose');

const goldRateSchema = new mongoose.Schema({
  source: String,
  ratePerGram: Number, // currency per gram
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GoldRate', goldRateSchema);
