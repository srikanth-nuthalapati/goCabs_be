const mysql = require('mysql2');
require('dotenv').config();

let db = mysql.createPool({
    host: process.env.host,
    port:process.env.db_port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    waitForConnections:true,
    connectionLimit:15,
    queueLimit:0
});

db.connect((err) => {
    if (err) {
        console.error('error connecting:', err);
    }
    else {
        console.log('mysql connected');
    }
})


module.exports = db;
