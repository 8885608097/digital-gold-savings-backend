const AuditLog = require("../models/AuditLog");

exports.logAction = async (req, action, details = {}) => {
  try {
    await AuditLog.create({
      userId: req.user?.id || null,
      action,
      details,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });
  } catch (err) {
    console.error("Audit Log Error:", err.message);
  }
};
