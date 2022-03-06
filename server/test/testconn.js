var mysql = require('mysql-await')

var con = mysql.createConnection({
    connectionLimit: 10,
    host: process.env.TEST_DATABASE_HOST,
    user: process.env.TEST_DATABASE_USER,
    password: process.env.TEST_DATABASE_PASSWORD,
    database: process.env.TEST_DATABASE_DATABASE,
})

con.connect((err) => {
    if (err) console.log(err + '\nError connecting to MySQL')
})

module.exports = con
