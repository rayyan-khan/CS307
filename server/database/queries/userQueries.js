var getCon = require('../conn')
var con = getCon.getConObject()

const isUser1FollowingUser2 = async (user1, user2) => {
    res = await con.awaitQuery(
        `SELECT * FROM UserFollow WHERE follower='${con.escape(user1)}' AND followed='${con.escape(user2)}'`
    )

    return res.length != 0
}

const getFollowersList = async (username, activeUser) => {
    return await con.awaitQuery(
        `SELECT follower as username, firstName, lastName, url FROM UserFollow JOIN User ON User.username = UserFollow.follower WHERE UserFollow.followed = "${con.escape(username)}" and User.username not in (Select userBlocking From Block where userBlocked = "${con.escape(activeUser)}" )`
    )
}

const getFollowingList = async (username) => {
    return await con.awaitQuery(
        `SELECT followed as username, firstName, lastName, url FROM UserFollow JOIN User ON User.username = UserFollow.followed WHERE UserFollow.follower = "${con.escape(username)}"`
    )
}

const getTagList = async (username) => {
    let res = await con.awaitQuery(
        `select tagID from TagFollow where username = "${con.escape(username)}"`
    )

    return res.map((tagObj) => {
        return tagObj.tagID
    })
}

module.exports = {
    isUser1FollowingUser2,
    getFollowersList,
    getFollowingList,
    getTagList,
}
