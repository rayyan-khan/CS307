var getCon = require('../conn')
var con = getCon.getConObject()

const isUser1FollowingUser2 = async (user1, user2) => {
    res = await con.awaitQuery(
        `SELECT * FROM UserFollow WHERE follower='${user1}' AND followed='${user2}'`
    )

    return res.length != 0
}

const getUserInteractions = async (username) => {
    res = await con.awaitQuery(`
        SELECT IF (Post.anonymous = 1, "Anonymous", Post.username) AS username, UserLike.postID, tagId, likesCount, dislikeCount,
        postCaption, numberOfComments, url, hyperlink, NULL as comment, true as liked, false as disliked,
        UserLike.timestamp
        FROM UserLike
        JOIN Post ON UserLike.postID = Post.postID
        WHERE UserLike.username="${username}"
        UNION
        SELECT IF (Post.anonymous = 1, "Anonymous", Post.username) AS username, UserDisLike.postID, tagID, likesCount, dislikeCount, 
        postCaption, numberOfComments, url, hyperlink, NULL as comment, false as liked, true as disliked,
        UserDisLike.timeStamp
        FROM UserDisLike
        JOIN Post ON UserDisLike.postID = Post.postID
        WHERE UserDisLike.username = "${username}"
        UNION
        SELECT IF (Post.anonymous = 1, "Anonymous", Post.username) AS username, Comments.postID, tagID, likesCount, dislikeCount,
        postCaption, numberOfComments, url, hyperlink, comment, false as liked, false as disliked,
        Comments.timestamp
        FROM Comments
        JOIN Post ON Comments.postID = Post.postID
        WHERE Comments.username = "${username}"
        ORDER BY timestamp DESC;
    `)

    return res
}

const bookmarkPost = async (username, postID) => {
    return await con.awaitQuery(
        `INSERT INTO Bookmark (username, postID, timestamp) VALUES ("${username}", ${postID}, NOW())`
    )
}

const unbookmarkPost = async (username, postID) => {
    return await con.awaitQuery(
        `DELETE FROM Bookmark WHERE username = "${username}" AND postID = "${postID}"`
    )
}

const getBookmarks = async (username) => {
    return await con.awaitQuery(`
        SELECT IF (Post.anonymous = 1, 
        IF (Post.username = "${username}", Post.username, "Anonymous"), Post.username) as username, 
        Bookmark.postID, tagId, likesCount, dislikeCount, postCaption, numberOfComments, url, hyperlink 
        FROM Bookmark
        JOIN Post ON Bookmark.postID = Post.postID
        WHERE Bookmark.username="${username}"
        ;
        `)
}

const postExists = async (postID) => {
    let res = await con.awaitQuery(
        `SELECT * FROM Post WHERE postID = "${postID}"`
    )

    return res.length != 0
}

const postBookmarked = async (username, postID) => {
    let res = await con.awaitQuery(
        `SELECT * FROM Bookmark WHERE username = "${username}" AND postID = "${postID}"`
    )

    return res.length != 0
}

module.exports = {
    isUser1FollowingUser2,
    getUserInteractions,
    bookmarkPost,
    unbookmarkPost,
    postExists,
    getBookmarks,
    postBookmarked,
}