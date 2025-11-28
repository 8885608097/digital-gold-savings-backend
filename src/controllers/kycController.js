const KYC = require("../models/KYC");
const { sendEmail } = require("../utils/emailService");
const templates = require("../utils/emailTemplates");
const { logAction } = require("../utils/auditLogger");


exports.submitKYC = async (req, res) => {
  try {
    const { fullName, dob, address, documentType, documentNumber } = req.body;

    const kyc = await KYC.create({
      userId: req.user.id,
      fullName,
      dob,
      address,
      documentType,
      documentNumber,
      documentImage: req.file ? req.file.path : null,
    });

    res.json({ success: true, message: "KYC submitted", kyc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getKYCStatus = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ userId: req.user.id });

    if (!kyc) return res.json({ success: true, status: "NO_KYC" });

    res.json({ success: true, status: kyc.status, kyc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// ADMIN: Approve KYC
exports.approveKYC = async (req, res) => {
  try {
    const { kycId } = req.params;

    const kyc = await KYC.findByIdAndUpdate(
      kycId,
      { status: "APPROVED", adminRemark: "Verified" },
      { new: true }
    );

    // Log action
    logAction(req, "KYC_APPROVED", { kycId });

    // Email user
    const user = await User.findById(kyc.userId);
    if (user) {
      sendEmail(
        user.email,
        "KYC Approved",
        templates.kycApproved(user.name)
      );
    }

    res.json({ success: true, message: "KYC Approved", kyc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ADMIN: Reject KYC
exports.rejectKYC = async (req, res) => {
  try {
    const { kycId } = req.params;
    const { remark } = req.body;

    // Update KYC
    const kyc = await KYC.findByIdAndUpdate(
      kycId,
      { status: "REJECTED", adminRemark: remark },
      { new: true }
    );
  logAction(req, "KYC_REJECTED", { kycId, remark });
    // Get the user to send email
    const user = await User.findById(kyc.userId);
    if (user) {
      sendEmail(
        user.email,
        "KYC Rejected",
        templates.kycRejected(user.name)
      );
    }

    res.json({ success: true, message: "KYC Rejected", kyc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
