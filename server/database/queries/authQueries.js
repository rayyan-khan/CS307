var con = require("../conn");

module.exports = {
    allUnverifiedUsersByEmail: async (email) => {
        return await con.awaitQuery(`SELECT * FROM UnverifiedUser WHERE email='${email}'`)
    },
    allVerifiedUsersByEmail: async (email) => {
        return await con.awaitQuery(`SELECT * FROM User WHERE email='${email}'`)
    },
    allUnverifiedUsersByUsername: async (username) => {
        return await con.awaitQuery(`SELECT * FROM UnverifiedUser WHERE username='${username}'`)
    },
    allVerifiedUsersByUsername: async (username) => {
        return await con.awaitQuery(`SELECT * FROM User WHERE username='${username}'`)
    },
    createUnverifiedUser: async (username, email, password, confirmationCode) => {
        return await con.awaitQuery(`INSERT INTO UnverifiedUser (username, email, password, confirmationCode) VALUES `
        + `('${username}', '${email}', '${password}', '${confirmationCode}')`)
    },
    verifyConfirmationCode: async (email, confirmationCode) => {
        return await con.awaitQuery(`SELECT * FROM UnverifiedUser WHERE email='${email}' ` 
        + `AND confirmationCode='${confirmationCode}'`)
    },
    createVerifiedUser: async (username, email, password) => {
        return await con.awaitQuery(`INSERT INTO User (email, username, password) `
        + `VALUES ('${email}', '${username}', '${password}')`)
    },
    deleteUnverifiedUser: async (username) => {
        return await con.awaitQuery(`DELETE FROM UnverifiedUser WHERE username='${username}'`)
    },
    getConfirmationCode: async (email) => {
        return await con.awaitQuery(`SELECT * FROM UnverifiedUser WHERE email='${email}'`)
    }
}