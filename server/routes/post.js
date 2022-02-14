const express = require('express');
const postRoutes = express.Router();

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