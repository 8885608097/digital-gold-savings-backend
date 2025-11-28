const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const {
  submitKYC,
  getKYCStatus,
  approveKYC,
  rejectKYC
} = require("../controllers/kycController");

// Accept ANY file type and ANY key
router.post(
  "/upload",
  auth,
  upload.any(),
  submitKYC
);

// USER ROUTES
router.get("/status", auth, getKYCStatus);

// ADMIN ROUTES
router.post("/:kycId/approve", auth, approveKYC);
router.post("/:kycId/reject", auth, rejectKYC);

module.exports = router;
