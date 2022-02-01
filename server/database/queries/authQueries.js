var con = require("../conn");

module.exports = {
    allUnverifiedUsersByEmail: async (email) => {
        return await con.awaitQuery(`SELECT * FROM unverified_users WHERE email='${email}'`)
    },
    allVerifiedUsersByEmail: async (email) => {
        return await con.awaitQuery(`SELECT * FROM verified_users WHERE email='${email}'`)
    },
    allUnverifiedUsersByUsername: async (username) => {
        return await con.awaitQuery(`SELECT * FROM unverified_users WHERE username='${username}'`)
    },
    allVerifiedUsersByUsername: async (username) => {
        return await con.awaitQuery(`SELECT * FROM verified_users WHERE username='${username}'`)
    },
    createUnverifiedUser: async (username, email, password, confirmationCode) => {
        return await con.awaitQuery(`INSERT INTO unverified_users (username, email, password, confirmationCode) VALUES `
        + `('${username}', '${email}', '${password}', '${confirmationCode}')`)
    },
    verifyConfirmationCode: async (email, confirmationCode) => {
        return await con.awaitQuery(`SELECT * FROM unverified_users WHERE email='${email}' ` 
        + `AND confirmationCode='${confirmationCode}'`)
    },
    createVerifiedUser: async (username, email, password) => {
        return await con.awaitQuery(`INSERT INTO verified_users (email, username, password) `
        + `VALUES ('${email}', '${username}', '${password}')`)
    },
    deleteUnverifiedUser: async (username) => {
        return await con.awaitQuery(`DELETE FROM unverified_users WHERE username='${username}'`)
    },
    getConfirmationCode: async (email) => {
        return await con.awaitQuery(`SELECT * FROM unverified_users WHERE email='${email}'`)
    }
}