const express = require('express');
const userRoutes = express.Router();
const s3 = require("../s3Bucket/create-bucket")

//
const multer  = require('multer')
//const upload = multer({ dest: 'uploads/' })
var storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            cb( null, file.originalname+ '-' +".jpg");
        }
    }
);

var upload = multer( { storage: storage } );
userRoutes.route("/profile").post( upload.single('image'), function (req, res) {
    var getId = "Select Max(postID) as ID From Post;"
 var Is;
    con.query(getId, function (err, result) {
        if (err){
            console.log(err);
            res.status(500).json(err);
        } else res.json(result)
        console.log(result[0].ID);
        Is = result[0].ID
        Is+=1//store the ID
        var sql = "INSERT INTO Post Values ('" + Is+ "', '" + Is + "', '" +req.body.username+ "', '" +"12', '14" +"', '" + req.body.caption+"', NOW(),'12"+"', '" + req.body.anonymous+ "')";


    //    var sql = "INSERT INTO Post Values (20,12,'ak',12,'12','12',NOW(),'12','1');"
        con.query(sql, function (err, results) {
            if (err) throw err;
            console.log("1 record inserted");
            console.log(results)
        });

    })

    // console.log(req.file)
    // s3.uploadFile(req.file.path);
    // res.json("user added")
})

//

//Use the below line in any file to connect to the database
var con = require("../database/conn");

userRoutes.route("/add").post(function (req, res) {
    console.log(req.file);
    var sql = "INSERT INTO User (username, password) VALUES ('" + req.body.username + "', '" + req.body.password + "')";

   // con.query(sql, function (err, result) {
   //     if (err) throw err;
   //     console.log("1 record inserted");
   //     console.log(result)
   // });

    res.json("user added")
});

userRoutes.route("/exists/:username").get(function (req, res) {
    var sql = "SELECT * FROM User WHERE username = '" + req.params.username + "'";
    console.log(sql);




    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)

        res.json(result.length != 0)
    })
})

userRoutes.route("/auth/:username/:password").get(function (req, res) {
    var sql = "SELECT * FROM users WHERE username = '" + req.params.username + "'" + " AND password = '" + req.params.password + "'";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result)

        res.json(result.length != 0)
    })
})

module.exports = userRoutes;