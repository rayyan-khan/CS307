const express = require('express')
const messageRoutes = express.Router()
//const s3 = require("../s3Bucket/create-bucket")
const decodeHeader = require('../utils/decodeHeader')
var getCon = require('../database/conn')
var con = getCon.getConObject()

messageRoutes.route('/messages/getHistory').post(async (req, res) => {
    let arr = [req.body.user1, req.body.user2]
    arr.sort()

    let sql = `SELECT ConversationID FROM Conversations WHERE user1 = '${arr[0]}' AND user2 = '${arr[1]}'`
    let result = await con.awaitQuery(sql)

    if (result.length === 0) {
        res.json(result)
    } else {
        sql = `SELECT message, fromUser, timeStamp FROM Messages WHERE ConversationID = ${result[0].ConversationID} ORDER BY timeStamp`;
        result = await con.awaitQuery(sql)

        res.json(result)
    }

})

messageRoutes.route('/messages/sendMessage').post(async (req, res) => {
    let arr = [req.body.fromUser, req.body.toUser]
    arr.sort()

    //let sql = `SELECT userBlocked WHERE (userBlocked = '${arr[0]}' AND userBlocking = '${arr[1]}') OR  (userBlocked = '${arr[1]}' AND userBlocking = '${arr[0]}')`;
    //let result = await con.awaitQuery(sql);

    //if (result.length !== 0) {
    //    res.json(result);
    // }
    let private = `SELECT private, username FROM User WHERE username='${req.body.toUser}'`
    let private_result = await con.awaitQuery(private)
    let { private_var } = private_result
    if (private_result[0].private === 1) {
        let follow = `SELECT * FROM UserFollow WHERE followed = '${req.body.fromUser}' AND follower = '${req.body.toUser}'`
        console.log(follow)
        let follow_result = await con.awaitQuery(follow);
        if (follow_result.length === 0) {
            console.log('Test this now please')
            return res.status(500).json('User is not following you!')
        }
    }

    let sql = `SELECT ConversationID FROM Conversations WHERE user1 = '${arr[0]}' AND user2 = '${arr[1]}'`
    let result = await con.awaitQuery(sql)

    if (result.length === 0) {
        insertQuery = `INSERT INTO Conversations(user1, user2) VALUES('${arr[0]}', '${arr[1]}');`
        await con.awaitQuery(insertQuery);
        result = await con.awaitQuery(sql);
    }

    sql = `INSERT INTO Messages VALUES('${req.body.fromUser}', '${req.body.toUser}', '${req.body.message}', '${result[0].ConversationID}', NOW()) `
    result = await con.awaitQuery(sql)

    res.json(result)
})

messageRoutes.route('/messages/deleteConvo').post(async (req, res) => {

    let arr = [req.body.currentUser, req.body.deletedUser]
    arr.sort()

    let sql = `SELECT ConversationID FROM Conversations WHERE user1 = '${arr[0]}' AND user2 = '${arr[1]}'`
    let result = await con.awaitQuery(sql)


    sql = `INSERT INTO DeletedConversations VALUES('${req.body.currentUser}', ${result[0].ConversationID})`
    result = await con.awaitQuery(sql)
    res.json(result)

})

messageRoutes.route('/messages/getConversations').post(async (req, res) => {

    let sql = `SELECT fromUser, toUser, message, timeStamp FROM Messages WHERE conversationID IN (SELECT ConversationID FROM Conversations WHERE (user1 = '${req.body.user}' OR user2 = '${req.body.user}')) AND (conversationID, timestamp) IN (SELECT conversationID,
        MAX(timeStamp) FROM Messages GROUP BY(conversationID)) AND conversationID NOT IN (SELECT conversationID FROM DeletedConversations WHERE username = '${req.body.user}') AND (fromUser, toUser) NOT IN (SELECT userBlocking, userBlocked FROM Block) AND (fromUser, toUser) NOT IN (SELECT userBlocked, userBlocking FROM Block) ORDER BY timeStamp DESC;`

    let result = await con.awaitQuery(sql)
    res.json(result)
})




module.exports = messageRoutes