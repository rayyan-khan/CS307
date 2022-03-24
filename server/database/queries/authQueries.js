var getCon = require('../conn')
var con = getCon.getConObject()

const allUnverifiedUsersByEmail = async (email) => {
    return await con.awaitQuery(
        `SELECT * FROM UnverifiedUser WHERE email='${email}'`
    )
}

const allVerifiedUsersByEmail = async (email) => {
    return await con.awaitQuery(`SELECT * FROM User WHERE email='${email}'`)
}

const allUnverifiedUsersByUsername = async (username) => {
    return await con.awaitQuery(
        `SELECT * FROM UnverifiedUser WHERE username='${username}'`
    )
}

const allVerifiedUsersByUsername = async (username) => {
    return await con.awaitQuery(
        `SELECT * FROM User WHERE username='${username}'`
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

const deleteUnverifiedUser = async (username) => {
    return await con.awaitQuery(
        `DELETE FROM UnverifiedUser WHERE username='${username}'`
    )
}

const getConfirmationCode = async (email) => {
    return await con.awaitQuery(
        `SELECT * FROM UnverifiedUser WHERE email='${email}'`
    )
}

const updatePassword = async (email, newPassword) => {
    return await con.awaitQuery(
        `UPDATE User SET password='${newPassword}' WHERE email='${email}'`
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

const getCurPassword = async (email) => {
    var res = await con.awaitQuery(
        `SELECT password FROM User WHERE email="${email}"`
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
    getCurPassword,
}
