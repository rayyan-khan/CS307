const express = require('express');
const userRoutes = express.Router();

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

module.exports = userRoutes;