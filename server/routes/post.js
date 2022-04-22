const express = require('express')
const postRoutes = express.Router()
//const s3 = require("../s3Bucket/create-bucket")
const decodeHeader = require('../utils/decodeHeader')
const query = require('../database/queries/postQueries')

//Use the below route to create a post and store into the database and S3
const s3 = require('../s3Bucket/create-bucket')
//
const multer = require('multer')
var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        console.log(file.originalname)
        cb(null, file.originalname + '.jpg')
    },
})
var upload = multer({ storage: storage })
postRoutes
    .route('/updateProfileImage')
    .post(upload.single('image'), async function (req, res) {
        var user
        console.log(req.body)
        try {
            //Use decodeHeader to extract user info from header or throw an error
            user = await decodeHeader.decodeAuthHeader(req)
        } catch (err) {
            return res.status(400).json(err)
        }

        const { email, username } = user
        console.log(username)

        s3.uploadFile(req.file).then((url) => {
            console.log('promise result ' + res)

            //url = "https://cs307.s3.amazonaws.com/" + req.file.path.substring(8)
            console.log(url)
            var sql = `UPDATE User Set url = "${con.escape(url)}" WHERE username= "${con.escape(username)}"`

            //    var sql = "INSERT INTO Post Values (20,12,'ak',12,'12','12',NOW(),'12','1');"
            con.query(sql, function (err, results) {
                if (err) throw err
                console.log('1 record inserted')
                console.log(results)
                return res.status(200).json(results)
            })
        })
    })

postRoutes
    .route('/posts/postImage')
    .post(upload.single('image'), async function (req, res) {
        //  var url = s3.uploadFile(req.file);
        //get username
        var user
        console.log(req.body)
        try {
            //Use decodeHeader to extract user info from header or throw an error
            user = await decodeHeader.decodeAuthHeader(req)
        } catch (err) {
            return res.status(400).json(err)
        }
        const { email, username } = user
        console.log(username)
        //

        var getId = 'Select Max(postID) as ID From Post;'
        var Is
        con.query(getId, async (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json(err)
            } else res.json(result)
            console.log(result[0].ID)
            Is = result[0].ID
            Is += 1 //store the ID
            //check if file is okay to store

            //
            //var url = 'garbage for a sec'
            s3.uploadFile(req.file).then((url) => {
                console.log('promise result ' + res)

                //url = "https://cs307.s3.amazonaws.com/" + req.file.path.substring(8)
                console.log(url)

                function checkEmpty(str) {
                    if (str === '') {
                        return 'null'
                    } else {
                        return con.escape(str)
                    }
                }

                var sql = `INSERT INTO Post Values (${Is}, ${checkEmpty(
                    con.escape(req.body.tag)
                )}, ${con.escape(username)}, 0, 0, ${checkEmpty(
                    con.escape(req.body.caption)
                )}, NOW(), 12, ${checkEmpty(con.escape(req.body.anonymous))}, ${checkEmpty(
                    con.escape(url)
                )}, ${checkEmpty(con.escape(req.body.hyperlink))})`

                //    var sql = "INSERT INTO Post Values (20,12,'ak',12,'12','12',NOW(),'12','1');"
                con.query(sql, function (err, results) {
                    if (err) throw err
                    console.log('1 record inserted')
                    console.log(results)
                })
            })
        })
    })

postRoutes.route('/getPostsByUser/:viewingUser').get(async (req, res) => {
    //  var sql = 'SELECT * From Post Order BY timeStamp DESC'
    let viewingUser = req.params.viewingUser
    if (!viewingUser) {
        return res.status(400).json('Missing viewingUser field')
    }

    var thisUser
    try {
        //Use decodeHeader to extract user info from header or throw an error
        thisUser = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        thisUser = undefined
    }

    thisUser = thisUser ? thisUser.username : undefined

    let sql

    if (thisUser && thisUser === viewingUser) {
        sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink, username, anonymous From Post WHERE username='${con.escape(viewingUser)}' Order BY timeStamp DESC`
    } else {
        sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink, username, anonymous From Post WHERE username='${con.escape(viewingUser)}' AND anonymous=0 Order BY timeStamp DESC`
    }

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else {
            res.json(result)
        }
    })
})

postRoutes.route('/postInteractions/:username').get(async (req, res) => {
    let interactions = await query
        .getUserInteractions(req.params.username)
        .catch((err) => {
            console.log(err)
            res.status(500).json('Error querying for all interactions')
        })

    res.json(
        interactions.map((postInteraction) => {
            postInteraction.liked = postInteraction.liked == 1 ? true : false
            postInteraction.disliked =
                postInteraction.disliked == 1 ? true : false

            return postInteraction
        })
    )
})

postRoutes.route('/posts/postNoImage').post(async function (req, res) {
    //  var url = s3.uploadFile(req.file);

    //get username
    var user
    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user
    console.log(username)
    //

    var getId = 'Select Max(postID) as ID From Post;'
    var Is
    con.query(getId, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
        console.log(result)
        console.log(result[0].ID)
        console.log(req.body)
        Is = result[0].ID
        Is += 1 //store the ID
        function checkEmpty(str) {
            if (str === '') {
                return 'null'
            } else {
                return con.escape(str)
            }
        }
        var sql = `INSERT INTO Post Values (${Is}, ${checkEmpty(
            con.escape(req.body.tag)
        )}, ${con.escape(username)}, 0, 0, ${checkEmpty(
            con.escape(req.body.caption)
        )}, NOW(), 12, ${checkEmpty(con.escape(req.body.anonymous))}, null, ${checkEmpty(
            con.escape(req.body.hyperlink)
        )})`
        //    var sql = "INSERT INTO Post Values (20,12,'ak',12,'12','12',NOW(),'12','1');"
        con.query(sql, function (err, results) {
            if (err) throw err
            console.log('1 record inserted')
            console.log(results)
        })
    })
})

// var upload = multer( { storage: storage } );
// userRoutes.route("/profile").post( upload.single('image'), function (req, res) {
//     var getId = "Select Max(postID) From Post;"
//
//     con.query(getId, function (err, result) {
//         if (err){
//             console.log(err);
//             res.status(500).json(err);
//         } else res.json(result)
//     })
//     //var sql = "INSERT INTO Post Values (20,12,'ak',12,'12','12',NOW(),'12','1');
//     console.log("hi")
//     //var url = s3.uploadFile(req.file);
//     res.json("user added")
// })

//
//Use the below line in any file to connect to the database
var getCon = require('../database/conn')
var con = getCon.getConObject()

postRoutes.route('/getSpecificPost/:postID').post(function (req, res) {
    var anony = 'Anonymous'
    var sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, anonymous, url, hyperlink,CASE WHEN anonymous=1 and username!=${con.escape(
        username
    )} THEN ${anony} ELSE username END From Post WHERE postId = ${con.escape(
        req.params.postID
    )}`
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

//use the below route to get information on a specific post
postRoutes.route('/getSpecificPost/:postID').get(async function (req, res) {
    let { postID } = req.body
    var user
    var sql

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
        const { email, username } = user
        sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, anonymous, url, hyperlink,CASE WHEN anonymous=1 and username!=${con.escape(
            username
        )} THEN "Anonymous" ELSE username END AS username, timeStamp From Post WHERE postId = ${con.escape(
            req.params.postID
        )}`
    } catch (err) {
        sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, anonymous, url, hyperlink,CASE WHEN anonymous=1 THEN "Anonymous" ELSE username END AS username, timeStamp From Post WHERE postId = ${con.escape(
            req.params.postID
        )}`
    }
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

//use the below route to get all the posts in order of time posted
postRoutes.route('/getOrderedPost').get(async function (req, res) {
    //  var sql = 'SELECT * From Post Order BY timeStamp DESC'
    var user
    var amUser = false
    var sql
    try {
        user = await decodeHeader.decodeAuthHeader(req)
        const { email, username } = user
        sql = `SELECT Post.postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink,CASE WHEN anonymous=1 and Post.username!=${con.escape(
            username
        )} THEN "Anonymous" ELSE Post.username END AS username, CASE WHEN UserLike.username = "${con.escape(username)}" THEN "1" ELSE "0" END AS isLiked, CASE WHEN UserDisLike.username = "${con.escape(username)}" THEN "1" ELSE "0" END AS isDisliked From Post LEFT JOIN UserLike ON Post.postID = UserLike.postID 
        LEFT JOIN UserDisLike ON Post.postID = UserDisLike.postID Order BY Post.timeStamp DESC`
    } catch (err) {
        user = undefined
        sql = `SELECT Post.postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink,CASE WHEN anonymous=1 THEN "Anonymous" ELSE Post.username END AS username, CASE WHEN Post.username = Post.username THEN "0" ELSE "1" END AS isLiked, CASE WHEN Post.username = Post.username THEN "0" ELSE "1" END AS isDisliked From Post LEFT JOIN UserLike ON Post.postID = UserLike.postID 
        Order BY Post.timeStamp DESC`
    }

    var anony = 'Anonymous'

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

//use the below route to get all the posts in order of time posted
postRoutes.route('/getPostWithTag/:tagid').get(async function (req, res) {
    //  var sql = 'SELECT * From Post Order BY timeStamp DESC'
    var user
    var amUser = false
    var sql
    try {
        user = await decodeHeader.decodeAuthHeader(req)
        const { email, username } = user
        sql = `SELECT Post.postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink,CASE WHEN anonymous=1 and Post.username!=${con.escape(
            username
        )} THEN "Anonymous" ELSE Post.username END AS username, CASE WHEN UserLike.username = "${con.escape(username)}" THEN "1" ELSE "0" END AS isLiked, CASE WHEN UserDisLike.username = "${con.escape(username)}" THEN "1" ELSE "0" END AS isDisliked From Post LEFT JOIN UserLike ON Post.postID = UserLike.postID 
        LEFT JOIN UserDisLike ON Post.postID = UserDisLike.postID WHERE Post.tagID = "${
            con.escape(req.params.tagid)
        }" and Post.username NOT IN (Select userBlocking FROM Block where userBlocked = "${con.escape(username)}")  Order BY Post.timeStamp DESC`
    } catch (err) {
        user = undefined
        sql = `SELECT Post.postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink,CASE WHEN anonymous=1 THEN "Anonymous" ELSE Post.username END AS username, CASE WHEN Post.username = Post.username THEN "0" ELSE "1" END AS isLiked, CASE WHEN Post.username = Post.username THEN "0" ELSE "1" END AS isDisliked From Post LEFT JOIN UserLike ON Post.postID = UserLike.postID 
        WHERE Post.tagID = "${con.escape(req.params.tagid)}" Order BY Post.timeStamp DESC`
    }

    var anony = 'Anonymous'

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

postRoutes.route('/comments/:postID').get(async function (req, res) {
    // var sql = `SELECT * FROM Comments WHERE postId = ${con.escape(
    //     req.params.postID
    // )} Order BY timeStamp DESC`
    var user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(300).json(err)
    }
    const { email, username } = user
    console.log('hi there')

    var sql = `SELECT * FROM Comments JOIN User ON User.username=Comments.username WHERE postId = ${con.escape(
        req.params.postID
    )} AND Comments.username NOT IN (Select userBlocking FROM Block WHERE userBlocked = ${con.escape(
        username
    )} ) Order BY timeStamp DESC`
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

postRoutes.route('/createComment').post(async function (req, res) {
    //  var url = s3.uploadFile(req.file);

    //get username
    // var user
    // try {
    //     //Use decodeHeader to extract user info from header or throw an error
    //     user = await decodeHeader.decodeAuthHeader(req)
    // } catch (err) {
    //     return res.status(400).json(err)
    // }

    // const { email, username } = user
    // console.log(username)
    //
    var sql = `Insert INTO Comments Values (${req.body.postID},${con.escape(
        req.body.username
    )},NOW(),${con.escape(req.body.comment)})`
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

postRoutes.route('/likeupdate').post(async (req, res) => {
    // var sql = `SELECT COUNT(*) AS NUM FROM UserLike WHERE username = '${req.body.username}' AND postID = ${req.body.postID}`
    var sql = `SELECT COUNT(*) AS NUM FROM ${con.escape(req.body.table)} WHERE username = '${con.escape(req.body.username)}' AND postID = ${con.escape(req.body.postID)}`
    var ans = -1
    var userExists = 'why'
    con.query(sql, async (err, result) => {
        if (err) {
            console.log(err)
        } else {
            ans = result[0].NUM
            if (ans === 0) {
                userExists = 'false'
            } else {
                userExists = 'true'
            }

            var insert = ''
            var val = ''

            if (userExists === 'false') {
                insert = `INSERT INTO ${con.escape(req.body.table)} VALUES('${con.escape(req.body.username)}', ${con.escape(req.body.postID)}, NOW())`
                val = 'Added'
            } else {
                insert = `DELETE FROM ${con.escape(req.body.table)} WHERE username = '${con.escape(req.body.username)}' AND postID = ${con.escape(req.body.postID)}`
                val = 'Deleted'
            }

            await con.awaitQuery(insert)

            if (userExists === 'false') {
                let otherTable = ''
                if (req.body.table === 'UserLike') {
                    otherTable = 'UserDisLike'
                } else {
                    otherTable = 'UserLike'
                }
                insert = `DELETE FROM ${con.escape(otherTable)} WHERE username = '${con.escape(req.body.username)}' AND postID = ${con.escape(req.body.postID)}`
            }
            await con.awaitQuery(insert)

            //Update like count
            let likeCount = await con.awaitQuery(
                `SELECT * FROM UserLike WHERE postID = "${con.escape(req.body.postID)}"`
            )
            let dislikeCount = await con.awaitQuery(
                `SELECT * FROM UserDisLike WHERE postID = "${con.escape(req.body.postID)}"`
            )

            await con.awaitQuery(
                `UPDATE Post set likesCount= ${likeCount.length}, dislikeCount = ${dislikeCount.length} where postID = ${con.escape(req.body.postID)};`
            )

            return res.json({ value: val })
        }
    })
})

postRoutes.route('/checkUserLike').get((req, res) => {
    //var ans = checkUser(req);
    var ans = 'hello'
    res.json({ value: ans })
})

postRoutes.route('/updateLikeCount').post((req, res) => {
    console.log(`${con.escape(req.body.change)}`)

    var count = ''

    if (req.body.table === 'UserLike') {
        count = 'likesCount'
    } else {
        count = 'dislikeCount'
    }

    var sql = `UPDATE Post SET ${count} = ${count} + ${con.escape(req.body.change)} WHERE postID = ${con.escape(req.body.postID)}`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        }
        console.log('FINAL')
        res.json('all good')
    })
})

postRoutes.route('/getTimeline').get(async (req, res) => {
    var user
    var sql = ''

    let loggedIn

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
        const { email, username } = user
        sql = `SELECT p.postID,p.tagID,p.likesCount,p.dislikeCount,p.postCaption,p.numberOfComments, p.url, p.hyperlink,CASE WHEN p.anonymous=1 and p.username!=${con.escape(
            username
        )} THEN "Anonymous" ELSE p.username END AS username, p.timeStamp
        FROM Post as p, TagFollow as t
        WHERE t.username = ${con.escape(
            username
        )} and p.tagID = t.tagID and p.username NOT IN (Select userBlocking FROM Block WHERE userBlocked = ${con.escape(
            username
        )} )
        UNION
        SELECT p.postID,p.tagID,p.likesCount,p.dislikeCount,p.postCaption,p.numberOfComments, p.url, p.hyperlink,CASE WHEN p.anonymous=1 and p.username!=${con.escape(
            username
        )} THEN "Anonymous" ELSE p.username END AS username, p.timeStamp
        From Post as p, UserFollow as u
        WHERE u.follower = ${con.escape(
            username
        )} and u.followed = p.username and p.anonymous = 0 and p.username NOT IN (Select userBlocking FROM Block WHERE userBlocked = ${con.escape(
            username
        )} )
        ORDER BY timeStamp DESC`

        loggedIn = true
    } catch (err) {
        sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink,CASE WHEN anonymous=1 THEN "Anonymous" ELSE username END AS username, timeStamp From Post Order BY timeStamp DESC`

        loggedIn = false
    }

    con.query(sql, async (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else {
            for (let i = 0; i < result.length; i++) {
                if (loggedIn) {
                    let isLiked = await con.awaitQuery(
                        `Select * From UserLike where username = "${con.escape(user.username)}" and postID = ${con.escape(result[i].postID)}`
                    )
                    let isDisLiked = await con.awaitQuery(
                        `Select * From UserDisLike where username = "${con.escape(user.username)}" and postID = ${con.escape(result[i].postID)}`
                    )

                    result[i].isLiked = `${isLiked.length}`
                    result[i].isDisliked = `${isDisLiked.length}`
                } else {
                    result[i].isLiked = '0'
                    result[i].isDisliked = '0'
                }
            }

            res.json(result)
        }
    })
})

postRoutes.route('/getBookmarks').get(async (req, res) => {
    let user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    let result = await query.getBookmarks(user.username).catch((err) => {
        console.log(err)
        res.status(500).json('Error executing getBookmarks query')
    })

    res.json(result)
})

postRoutes.route('/deletePost').post(async (req, res) => {
    let { postID } = req.body
    var user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user

    let checkAuthor = `SELECT * FROM Post WHERE postID = "${con.escape(postID)}" AND username = "${con.escape(username)}"`

    let isAuthor = await con.awaitQuery(checkAuthor)
    if (isAuthor.length == 0) {
        return res.status(400).json('User is not creator of post')
    }

    var sql = `DELETE FROM Post WHERE postID = ${con.escape(
        postID
    )} and username = ${con.escape(username)}`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json('Successfully deleted post')
    })
})

postRoutes.route('/createBookmark').post(async function (req, res) {
    let user
    try {
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json('Missing auth token')
    }

    const { postID } = req.body

    if (!postID) {
        return res.status(400).json('Missing postID field')
    }

    if (!(await query.postExists(postID))) {
        return res.status(400).json("Post doesn't exist")
    }

    if (await query.postBookmarked(user.username, postID)) {
        return res.status(400).json('Post already bookmarked')
    }

    query.bookmarkPost(user.username, postID).catch((err) => {
        console.log(err)
        return res.stauts(500).json('Bookmark post query failed')
    })

    return res.json('Post bookmarked')
})

postRoutes.route('/deleteBookmark').post(async function (req, res) {
    let user
    try {
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json('Missing auth token')
    }

    const { postID } = req.body

    if (!postID) {
        return res.status(400).json('Missing postID field')
    }

    if (!(await query.postExists(postID))) {
        return res.status(400).json("Post doesn't exist")
    }

    if (!(await query.postBookmarked(user.username, postID))) {
        return res.status(400).json('Post not bookmarked')
    }

    query.unbookmarkPost(user.username, postID).catch((err) => {
        console.log(err)
        return res.stauts(500).json('Unbookmark post query failed')
    })

    return res.json('Post unbookmarked')
})

module.exports = postRoutes
