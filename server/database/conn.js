var mysql = require('mysql-await')

var con = mysql.createConnection({
    connectionLimit: 10,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
})

con.connect((err) => {
    //Suppress log when in test
    if (!process.env.NODE_ENV || process.env.NODE_ENV.trim() !== 'test') {
        if (err) console.log(err + '\nError connecting to MySQL')
        else console.log('Successfully connected to MySQL')
    }
})

const getConObject = () => {
    return con
}

module.exports = { getConObject }
