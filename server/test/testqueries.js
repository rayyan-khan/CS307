const con = require('./testconn')

const mysql = require('mysql')

let con2 = mysql.createConnection({
    host: process.env.TEST_DATABASE_HOST,
    user: process.env.TEST_DATABASE_USER,
    password: process.env.TEST_DATABASE_PASSWORD,
    database: process.env.TEST_DATABASE_DATABASE,
})

con2.connect((err) => {
    if (!err) console.log('connected')
})

const cleanDatabase = async () => {
    await con.awaitQuery('DELETE FROM unverifieduser WHERE true')
    await con.awaitQuery('DELETE FROM user WHERE true')
}

const createUnverifiedUser = async (
    username,
    email,
    password,
    confirmationCode
) => {
    return await con.awaitQuery(
        `INSERT INTO UnverifiedUser (username, email, password, confirmationCode) VALUES ` +
            `('${username}', '${email}', '${password}', '${confirmationCode}')`
    )
}

const verifyConfirmationCode = async (email, confirmationCode) => {
    return await con.awaitQuery(
        `SELECT * FROM UnverifiedUser WHERE email='${email}' ` +
            `AND confirmationCode='${confirmationCode}'`
    )
}

const createVerifiedUser = async (username, email, password) => {
    return await con.awaitQuery(
        `INSERT INTO User (email, username, password) ` +
            `VALUES ('${email}', '${username}', '${password}')`
    )
}

const allVerifiedUsersByEmail = async (email) => {
    return await con.awaitQuery(`SELECT * FROM User WHERE email='${email}'`)
}

module.exports = {
    cleanDatabase,
    createUnverifiedUser,
    verifyConfirmationCode,
    createVerifiedUser,
    allVerifiedUsersByEmail,
}
