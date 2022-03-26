const express = require('express')
const postRoutes = express.Router()
const query = require('../database/queries/postQueries')
const decodeHeader = require('../utils/decodeHeader')

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
            var sql =
                "UPDATE User Set url = '" +
                url +
                "' WHERE username= '" +
                username +
                "'"

            //    var sql = "INSERT INTO Post Values (20,12,'ak',12,'12','12',NOW(),'12','1');"
            con.query(sql, function (err, results) {
                if (err) throw err
                console.log('1 record inserted')
                console.log(results)
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
                var sql = `INSERT INTO Post Values (${Is}, ${Is}, ${con.escape(
                    username
                )}, 12, 14, ${checkEmpty(
                    req.body.caption
                )}, NOW(), 12, ${checkEmpty(req.body.anonymous)}, ${checkEmpty(
                    url
                )}, ${checkEmpty(req.body.hyperlink)})`

                //    var sql = "INSERT INTO Post Values (20,12,'ak',12,'12','12',NOW(),'12','1');"
                con.query(sql, function (err, results) {
                    if (err) throw err
                    console.log('1 record inserted')
                    console.log(results)
                })
            })
        })
        //
        // // console.log(req.file)
        // // s3.uploadFile(req.file.path);
        // // res.json("user added")
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
        console.log(result[0].ID)
        Is = result[0].ID
        Is += 1 //store the ID
        function checkEmpty(str) {
            if (str === '') {
                return 'null'
            } else {
                return con.escape(str)
            }
        }
        var sql = `INSERT INTO Post Values (${Is}, ${Is}, ${con.escape(
            username
        )}, 12, 14, ${checkEmpty(req.body.caption)}, NOW(), 12, ${checkEmpty(
            req.body.anonymous
        )}, null, ${checkEmpty(req.body.hyperlink)})`
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
    var sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, anonymous, url, hyperlink,CASE WHEN anonymous=1 THEN ${anony} ELSE username END From Post WHERE postId = ${con.escape(
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
postRoutes.route('/getSpecificPost/:postID').get(function (req, res) {
    var anony = 'Anonymous'
    var sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, anonymous, url, hyperlink,CASE WHEN anonymous=1 THEN "Anonymous" ELSE username END AS username From Post WHERE postId = ${con.escape(
        req.params.postID
    )}`
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

//use the below route to get all the posts in order of time posted
postRoutes.route('/getOrderedPost').get(function (req, res) {
    //  var sql = 'SELECT * From Post Order BY timeStamp DESC'
    var anony = 'Anonymous'
    var sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink,CASE WHEN anonymous=1 THEN "Anonymous" ELSE username END AS username From Post Order BY timeStamp DESC`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
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

    console.log(thisUser)

    thisUser = thisUser ? thisUser.username : undefined

    let sql

    if (thisUser && thisUser === viewingUser) {
        sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink, username, anonymous From Post WHERE username='${viewingUser}' Order BY timeStamp DESC`
    } else {
        sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink, username, anonymous From Post WHERE username='${viewingUser}' AND anonymous=0 Order BY timeStamp DESC`
    }

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else {
            console.log(result)

            res.json(result)
        }
    })
})

postRoutes.route('/comments/:postID').get(function (req, res) {
    var sql = `SELECT * FROM Comments WHERE postId = ${con.escape(
        req.params.postID
    )} Order BY timeStamp DESC`
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

postRoutes.route('/postInteractions').get((req, res) => {
    var anony = 'Anonymous'
    var sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink,CASE WHEN anonymous=1 THEN "Anonymous" ELSE username END AS username From Post Order BY timeStamp DESC`

    const interaction1 = { liked: true, disliked: false, comment: '' }
    const dumInteractions = [
        { liked: true, disliked: false, comment: '' },
        { liked: false, disliked: true, comment: '' },
        { liked: false, disliked: false, comment: 'This is a comment' },
    ]

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else {
            let postInteractions = result.map((postInteraction) => {
                return {
                    ...postInteraction,
                    ...dumInteractions[Math.floor(Math.random() * 3)],
                }
            })

            res.json(postInteractions)
        }
    })
})

postRoutes.route('/getTimeline').get(async (req, res) => {
    var user
    var sql = ''

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
        sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink,CASE WHEN anonymous=1 THEN "Anonymous" ELSE username END AS username From Post Order BY timeStamp DESC`
    } catch (err) {
        sql = `SELECT postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink,CASE WHEN anonymous=1 THEN "Anonymous" ELSE username END AS username From Post Order BY timeStamp DESC`
    }

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

postRoutes.route('/bookmarkPost').post(async (req, res) => {
    let { postID } = req.body

    if (!postID) return res.status(400).json('Missing postID field')

    let user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    let username = user.username

    if (!(await query.postExists(postID))) {
        return res.status(400).json('Post does not exist')
    }

    await query.bookmarkPost(username, postID).catch((err) => {
        console.log(err)
        res.status(500).json('Error executing bookmarkPost SQL statement')
    })

    res.json('Successfully bookmarked post')
})

module.exports = postRoutes
