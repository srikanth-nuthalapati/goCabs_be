const express = require('express');
const { resetOtp } = require('../controllers/resetOtp');
const router = express.Router();

router.post('/reset/otp', resetOtp);

module.exports = router;