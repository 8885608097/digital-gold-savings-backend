const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { logAction } = require("../utils/auditLogger");

// Generate JWT
function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}


// ---------------------------------------
// REGISTER
// ---------------------------------------
exports.register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔥 DO NOT HASH HERE — model will auto hash
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    const token = signToken(user);

    logAction(req, "REGISTER", { email });

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ---------------------------------------
// LOGIN
// ---------------------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    // 🔥 Compare hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    logAction(req, "LOGIN", { email });

    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
