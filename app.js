const express = require('express');
const app = express();
const cors = require('cors');
const forgotPasswordRoute = require('./routes/forgotPasswordRoute');
const loginRoute = require('./routes/loginRoute');
const resetOtpRoute = require('./routes/resetOtpRoute');
const resetPasswordRoute = require('./routes/resetPasswordRoute');
const signupRoute = require('./routes/signupRoute');
const signupOtpRoute = require('./routes/signupOtpRoute');
require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/api', forgotPasswordRoute);
app.use('/api',loginRoute);
app.use('/api',resetOtpRoute);
app.use('/api',resetPasswordRoute);
app.use('/api',signupRoute);
app.use('/api',signupOtpRoute);

const PORT = process.env.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));