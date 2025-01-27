const express = require('express');
const { signupOtp } = require('../controllers/signup');
const router = express.Router();

router.post('/signup/otp', signupOtp);

module.exports = router;