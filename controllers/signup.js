const bcrypt = require('bcrypt');
const db = require('../config/dao');
const generateOtp = require('../utils/otp');
const { validName, validEmail, validPassword} = require('../utils/validators');
const transporter = require('../config/mail');

let userDetails = {
    name: '',
    email: '',
    password: '',
}

exports.signup =  (req, res) => {
    const { name, email, password } = req.body;

    userDetails.name = name;
    userDetails.email = email;
    userDetails.password = password

    if (!validName.test(name)) {
        return res.status(400).send({
            message: 'Invalid name',
        });
    }
    if (!validEmail.test(email)) {
        return res.status(400).send({
            message: 'Invalid email',
        });
    }
    if (!validPassword.test(password)) {
        return res.status(400).send({
            message: 'Invalid password',
        });
    }

    const checkEmail = 'select * from users where email = ?';
    db.query(checkEmail, [email], (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Error: ' + err.message });
        }

        if (result.length > 0) {
            return res.status(201).send({ message: 'Email already exists. pls login' });
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
                subject: 'Your GoCabs Registration OTP',
                text: `Hi there!\n\nThank you for registering with GoCabs. To complete your registration, please use the OTP below:\n\nYour OTP: ${otpCode}\n\nThis OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.\n\nWelcome to GoCabs, and we look forward to serving your transportation needs!`
            };

            transporter.sendMail(options, (err, info) => {
                if (err) {
                    return res.status(400).send({
                        message: 'Error sending OTP email: ' + err.message,
                    });
                }

                res.status(200).send({
                    message: 'OTP has been sent to your email.',
                    email: email,
                });
            });
        });
    });
}


exports.signupOtp = (req, res) => {
    const { email, otp } = req.body;

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

        let salt = 10;
        let hashedPass = bcrypt.hashSync(userDetails.password, salt);

        const saveUser = `insert into users (name, email, password)
                           values (?, ?, ?)`
            ;
        db.query(
            saveUser,
            [userDetails.name, userDetails.email, hashedPass],
            (err, result) => {
                if (err) {
                    return res.status(500).send({
                        message: 'Error: ' + err.message,
                    });
                }

                const deleteOtp = `delete from otp_store where email = ?`;
                db.query(deleteOtp, [email], (err) => {
                    if (err) {
                        return res.status(500).send({
                            message: 'failed to delete otp' + err.message,
                        })
                    }
                });
                res.status(200).send({
                    message: 'User created successfully.',
                });
            }
        )
    });
}

