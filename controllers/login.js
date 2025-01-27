const bcrypt = require('bcrypt');
const db = require('../config/dao');
const jwt = require('jsonwebtoken');



const SECRET_KEY = process.env.jwt_secret;

exports.login = (req,res) => {
    const { email, password } = req.body;
    let verifyUser = `select * from users where email = ?`;
    db.query(verifyUser, [email], (err, result) => {
        if (err) {
            return res.status(500).send({message: err.message});
        }
        if (result.length === 0) {
            return res.status(400).send({message: 'User not found, pls signup'});
        }
        const user = result[0];

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({message: 'Invalid credentials.'});
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000, // 1 hour in milliseconds
            sameSite: 'strict',
        });
        
        return res.status(200).send({
            message: 'User logged in successfully.',
            token: token,
        });
           
    });
}