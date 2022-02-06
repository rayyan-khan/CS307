const express = require('express');
const userRoutes = express.Router();
const decodeHeader = require('../utils/decodeHeader')

//Use the below line in any file to connect to the database
var con = require("../database/conn");

userRoutes.route("/add").post(function (req, res) {
    var sql = "INSERT INTO User (username, password) VALUES ('" + req.body.username + "', '" + req.body.password + "')";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        console.log(result)
    });

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

userRoutes.route("/updateProfile").put( async (req, res) => {
    var user;

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const {email, username} = user
    const bio = req.body.bio

    var sql = `UPDATE User SET bio = '${bio}' WHERE username = '${username}'`

    con.query(sql, function (err, result) {
        console.log(result)
        if (err) {
            console.log(result)
            return res.status(500).json(err)
        }

        res.status(200).json("Updated successfully")
    })
})

module.exports = userRoutes;