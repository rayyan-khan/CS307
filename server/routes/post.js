const express = require('express');
const postRoutes = express.Router();
//const s3 = require("../s3Bucket/create-bucket")
const userRoutes = express.Router();


//Use the below route to create a post and store into the database and S3
const s3 = require("../s3Bucket/create-bucket")
//
const multer  = require('multer')
var storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function ( req, file, cb ) {
            cb( null, "imageTemp" +".jpg");
        }
    }
);

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
postRoutes.route("/getSpecificPost/:postID").post(function (req,res) {
    var sql = "SELECT * From Post WHERE postId = '" + req.params.postID + "'";
    con.query(sql, function (err, result) {
        if (err){
            console.log(err);
            res.status(500).json(err);
        } else res.json(result)
    })
})


//Use the below line in any file to connect to the database
var con = require("../database/conn");
//use the below route to get information on a specific post
postRoutes.route("/getSpecificPost/:postID").get(function (req,res) {
  var sql = "SELECT * From Post WHERE postId = '" + req.params.postID + "'";
    con.query(sql, function (err, result) {
        if (err){
            console.log(err);
            res.status(500).json(err);
        } else res.json(result)
    })
})

//use the below route to get all the posts in order of time posted
postRoutes.route("/getOrderedPost").get(function (req,res) {
    var sql = "SELECT * From Post Order BY timeStamp DESC";
    s3.uploadFile('./CS307/server/s3Bucket/cat.jpg');

    con.query(sql, function (err, result) {
        if (err){
            console.log(err);
            res.status(500).json(err);
        } else res.json(result)
    })
})

module.exports = postRoutes;

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