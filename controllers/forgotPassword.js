const db = require('../config/dao');
const generateOtp = require('../utils/otp');
const transporter = require('../config/mail');


exports.forgotPassword =  (req,res) => {
    const { email } = req.body;
    
    let verifyUser = `select * from users where email = ?`;
    db.query(verifyUser, [email], (err, result) => {
        if (err) {
            return res.status(500).send({message: err.message});
        }
        if (result.length === 0) {
            return res.status(400).send({message: 'User not found, pls signup'});
        }
        const otpCode = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        let saveOtp = 'insert into otp_store (email,code,expiresAt) values(?,?,?)';

        db.query(saveOtp, [email, otpCode, expiresAt], (err, info) => {
            if (err) {
                return res.status(500).send({
                    message: 'Error: ' + err.message,
                });
            }
            let options = {
                from: process.env.mail,
                to: email,
                subject: 'Password reset Otp',
                text: `Your OTP to reset your password is: ${otpCode}. It will expire in 10 minutes`
            };

            transporter.sendMail(options, (err, info) => {
                if (err) {
                    return res.status(400).send({
                        message: 'Error sending OTP email: ' + err.message,
                    });
                }

                res.status(200).send({
                    message: 'OTP has been sent to your email.',
                });
            });
        });

        
    })
}