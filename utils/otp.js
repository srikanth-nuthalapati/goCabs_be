 function generateOtp(){
    const otp = Math.floor(Math.random() * 10000);
    return otp.toString().padStart(4,'0');
}

module.exports = generateOtp;
