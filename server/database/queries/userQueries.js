var getCon = require('../conn')
var con = getCon.getConObject()

const isUser1FollowingUser2 = async (user1, user2) => {
    res = await con.awaitQuery(
        `SELECT * FROM UserFollow WHERE follower='${user1}' AND followed='${user2}'`
    )

    return res.length != 0
}

module.exports = {
    isUser1FollowingUser2,
}
