const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

// REMOVE this until you actually create refreshToken()
// router.post('/refresh', authController.refreshToken);

module.exports = router;
