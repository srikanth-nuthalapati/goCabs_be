const nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // or 'STARTTLS'
    auth: {
        user: process.env.mail,
        pass: process.env.apppass,
    }
});

module.exports = transporter;