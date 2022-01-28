const express = require('express');
var mysql = require('mysql');

// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const userRoutes = express.Router();

//Database
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "mydb"
  });

userRoutes.route("/add").post(function (req, res) {
    var sql = "INSERT INTO users (username, password) VALUES ('" + req.body.username + "', '" + req.body.password + "')";

    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        console.log(result)
    });

    res.json("user added")
});

userRoutes.route("/exists/:username").get(function (req, res) {
    var sql = "SELECT * FROM users WHERE username = '" + req.params.username + "'";

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