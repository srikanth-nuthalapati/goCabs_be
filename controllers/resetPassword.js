const bcrypt = require('bcrypt');
const db = require('../config/dao');
const { validPassword} = require('../utils/validators');


exports.resetPassword =  (req,res) => {
    const { email, newPassword } = req.body;
    if ( !validPassword.test(newPassword)){
        return res.status(400).send({ message: 'password should contain 1 upper, 1 lower, 1 special, 1 number and atleast 6 characters' });
    }
    let salt = 10;
    let hashedPass = bcrypt.hashSync(newPassword, salt);
    const updatePassword = `update users set password = ? where email = ?`;
    db.query(updatePassword, [hashedPass, email], (err,result) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(400).send({ message: 'Email not found' });
        }
        return res.status(200).send({ message: 'Password updated successfully' });
    });
}