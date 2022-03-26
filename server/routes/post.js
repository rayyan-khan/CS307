const express = require('express')
const postRoutes = express.Router()
//const s3 = require("../s3Bucket/create-bucket")
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
            var sql = "UPDATE User Set url = '" + url + "' WHERE username= '" + username + "'";


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
postRoutes.route('/getOrderedPost').get(async function (req, res) {
    //  var sql = 'SELECT * From Post Order BY timeStamp DESC'
    var user
    var amUser = false
    try {
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        user = undefined
    }

    
    const { email, username } = user
    
    
    var anony = 'Anonymous'
    var sql = `SELECT Post.postID,tagID,likesCount,dislikeCount,postCaption,numberOfComments, url, hyperlink,CASE WHEN anonymous=1 THEN "Anonymous" ELSE Post.username END AS username, CASE WHEN UserLike.username = "${username}" THEN "1" ELSE "0" END AS isLiked From Post LEFT JOIN UserLike ON Post.postID = UserLike.postID 
     Order BY timeStamp DESC`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

postRoutes.route('/comments/:postID').get(function(req,res) {
    var sql = `SELECT * FROM Comments WHERE postId = ${con.escape(req.params.postID)} Order BY timeStamp DESC`
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
    var sql = `Insert INTO Comments Values (${req.body.postID},${con.escape(req.body.username)},NOW(),${con.escape(req.body.comment)})`
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

postRoutes.route('/likeupdate').post((req, res) => {
    
    // var sql = `SELECT COUNT(*) AS NUM FROM UserLike WHERE username = '${req.body.username}' AND postID = ${req.body.postID}`

    var sql = `SELECT COUNT(*) AS NUM FROM UserLike WHERE username = '${req.body.username}' AND postID = ${req.body.postID}`
    var ans = -1
    var userExists = 'why'
    con.query(sql, function (err, result) {
        
        if (err) {
            console.log(err)
        } else {
            ans = result[0].NUM
            console.log(ans);
            if (ans === 0) {
                userExists = 'false'
            } else {
                userExists = 'true'
            }

            var insert = ''
            var val = ''
        
            console.log(userExists);
        
            if (userExists === 'false') {
                console.log("RERE")
                insert = `INSERT INTO UserLike VALUES('${req.body.username}', ${req.body.postID})`
                val = "Added"
                           
            } else {
                    console.log("WRONG")
                    insert = `DELETE FROM UserLike WHERE username = '${req.body.username}' AND postID = ${req.body.postID}`
                    val = "Deleted"
            }
        
            con.query(insert, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    res.json({value : val});
                }
            })
        }
    })

    // var userExists = checkUser(req);

            //res.json(["Error2"])
})

postRoutes.route('/checkUserLike').get((req, res) => {
    //var ans = checkUser(req);
    var ans = "hello";
    res.json({value : ans});
    
})


function checkUser(req) {

}

postRoutes.route('/updateLikeCount').post((req, res) => {
    console.log(`${req.body.change}`);
    console.log("CHECK WHAT HAPPENED");

    var sql = `UPDATE Post SET likesCount = likesCount + ${req.body.change} WHERE postID = ${req.body.postID}`

    con.query(sql,function(err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        }
        console.log("FINAL")
        res.json("all good")
    })
    
});


module.exports = postRoutes

//userRoutes.route("/testing").post(function (req, res) {
//  console.log(req.body);
//   var sql = "INSERT INTO User (username, password) VALUES ('" + req.body.username + "', '" + req.body.password + "')";

//  con.query(sql, function (err, result) {
//       if (err) throw err;
//        console.log("1 record inserted");
//        console.log(result)
//    });

//  res.json("user added")/
//});
//
// userRoutes.route("/exists/:username").get(function (req, res) {
//     var sql = "SELECT * FROM users WHERE username = '" + req.params.username + "'";
//
//     con.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log(result)
//
//         res.json(result.length != 0)
//     })
// })
