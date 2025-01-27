const db = require('../config/dao');

exports.resetOtp = (req,res) => {
    const { email, otp} = req.body;
    
    const verifyOtp = `select * from otp_store where email = ? and code = ? and expiresAt > NOW()`;

    db.query(verifyOtp, [email, otp], (err, result) => {
        if (err) {
            return res.status(500).send({
                message: 'Error: ' + err.message,
            });
        }
        if (result.length === 0) {
            return res.status(400).send({
                message: 'Invalid or expired OTP',
            });
        }

        return res.status(200).send({
            message: 'OTP is valid',
            email: email,
        });
    });
}