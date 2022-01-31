var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE
})

con.connect((err) => {
    if (err) console.log(err + "\nError connecting to MySQL");
    else console.log("Successfully connected to MySQL")
})

module.exports = con;