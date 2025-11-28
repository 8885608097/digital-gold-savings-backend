const mongoose = require("mongoose");

const KYCSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  fullName: String,
  dob: String,
  address: String,

  documentType: { type: String, enum: ["AADHAAR", "PAN", "PASSPORT"] },
  documentNumber: String,

  documentImage: String, // URL or file path

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },

  adminRemark: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("KYC", KYCSchema);
