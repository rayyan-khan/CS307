var getCon = require('../conn')
var con = getCon.getConObject()

const allUnverifiedUsersByEmail = async (email) => {
    return await con.awaitQuery(
        `SELECT * FROM UnverifiedUser WHERE email='${con.escape(email)}'`
    )
}

const allVerifiedUsersByEmail = async (email) => {
    return await con.awaitQuery(`SELECT * FROM User WHERE email='${con.escape(email)}'`)
}

const allUnverifiedUsersByUsername = async (username) => {
    return await con.awaitQuery(
        `SELECT * FROM UnverifiedUser WHERE username='${con.escape(username)}'`
    )
}

const allVerifiedUsersByUsername = async (username) => {
    return await con.awaitQuery(
        `SELECT * FROM User WHERE username='${con.escape(username)}'`
    )
}

const createUnverifiedUser = async (
    username,
    email,
    password,
    confirmationCode
) => {
    return await con.awaitQuery(
        `INSERT INTO UnverifiedUser (username, email, password, confirmationCode) VALUES ` +
            `('${con.escape(username)}', '${con.escape(email)}', '${con.escape(password)}', '${con.escape(confirmationCode)}')`
    )
}

const verifyConfirmationCode = async (email, confirmationCode) => {
    return await con.awaitQuery(
        `SELECT * FROM UnverifiedUser WHERE email='${con.escape(email)}' ` +
            `AND confirmationCode='${con.escape(confirmationCode)}'`
    )
}

const createVerifiedUser = async (username, email, password) => {
    return await con.awaitQuery(
        `INSERT INTO User (email, username, password) ` +
            `VALUES ('${con.escape(email)}', '${con.escape(username)}', '${con.escape(password)}')`
    )
}

const deleteUnverifiedUser = async (username) => {
    return await con.awaitQuery(
        `DELETE FROM UnverifiedUser WHERE username='${con.escape(username)}'`
    )
}

const getConfirmationCode = async (email) => {
    return await con.awaitQuery(
        `SELECT * FROM UnverifiedUser WHERE email='${con.escape(email)}'`
    )
}

const updatePassword = async (email, newPassword) => {
    return await con.awaitQuery(
        `UPDATE User SET password='${con.escape(newPassword)}' WHERE email='${con.escape(email)}'`
    )
}

const accountExists = async (email) => {
    const allVerified = await allVerifiedUsersByEmail(email)

    if (allVerified.length == 0) {
        const allUnverified = await allUnverifiedUsersByEmail(email)

        if (allUnverified == 0) {
            return 'No account with that email'
        } else {
            return 'Account not verified'
        }
    } else {
        return 'Account exists'
    }
}

const accountExistsUsername = async (username) => {
    const allVerified = await allVerifiedUsersByUsername(username)

    if (allVerified.length == 0) {
        const allUnverified = await allUnverifiedUsersByUsername(username)

        if (allUnverified == 0) {
            return 'No account with that username'
        } else {
            return 'Account not verified'
        }
    } else {
        return 'Account exists'
    }
}

const getCurPassword = async (email) => {
    var res = await con.awaitQuery(
        `SELECT password FROM User WHERE email="${con.escape(email)}"`
    )

    return res[0].password
}

module.exports = {
    allUnverifiedUsersByEmail,
    allVerifiedUsersByEmail,
    allUnverifiedUsersByUsername,
    allVerifiedUsersByUsername,
    createUnverifiedUser,
    verifyConfirmationCode,
    createVerifiedUser,
    deleteUnverifiedUser,
    getConfirmationCode,
    updatePassword,
    accountExists,
    accountExistsUsername,
    getCurPassword,
}
