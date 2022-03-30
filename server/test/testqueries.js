const con = require('./testconn')

const mysql = require('mysql')

let con2 = mysql.createConnection({
    host: process.env.TEST_DATABASE_HOST,
    user: process.env.TEST_DATABASE_USER,
    password: process.env.TEST_DATABASE_PASSWORD,
    database: process.env.TEST_DATABASE_DATABASE,
})

con2.connect((err) => {
    if (err) console.log(err)
})

const cleanDatabase = async () => {
    let tableNames = [
        'unverifieduser',
        'user',
        'post',
        'bookmark',
        'comments',
        'tag',
        'userlike',
        'userdislike',
        'userfollow',
    ]

    await con.awaitQuery('SET FOREIGN_KEY_CHECKS = 0;')

    for (let i = 0; i < tableNames.length; i++) {
        await con.awaitQuery(`DELETE FROM ${tableNames[i]} WHERE true`)
    }

    await con.awaitQuery('SET FOREIGN_KEY_CHECKS = 1;')
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

const createPost = async (postID, tagID, username, postCaption, anonymous) => {
    return await con.awaitQuery(`
    INSERT INTO Post Values 
    (${postID}, ${tagID}, '${username}', 0, 0, '${postCaption}', NOW(), 0, ${anonymous}, null, null);
    `)
}

const numberOfLikes = async (postID) => {
    return await con.awaitQuery(
        `SELECT likesCount FROM Post WHERE postID = "${postID}"`
    )
}

module.exports = {
    cleanDatabase,
    createUnverifiedUser,
    verifyConfirmationCode,
    createVerifiedUser,
    allVerifiedUsersByEmail,
    createPost,
    numberOfLikes,
}
