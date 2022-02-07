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
    var set = "SET"

    if (req.body["bio"] != undefined) {
        var bio = req.body.bio
        if (bio.length > 200 || bio.length < 0) {
            return res.status(400).json("Bad bio")
        }
        if (set != "SET") {
            set += `,`
        }
        set += ` bio = ${con.escape(bio)}`
    }
    if (req.body["private"] != undefined) {
        var private = req.body.private
        if (private != 0 && private != 1) {
            return res.status(400).json("Bad private")
        }
        if (set != "SET") {
            set += `,`
        }
        set += ` private = ${con.escape(private)}`
    }
    if (req.body["firstName"] != undefined) {
        var firstName = req.body.firstName
        if (firstName.length > 30 || firstName.length < 0) {
            return res.status(400).json("Bad firstName")
        }
        if (set != "SET") {
            set += `,`
        }
        set += ` firstName = ${con.escape(firstName)}`
    }
    if (req.body["lastName"] != undefined) {
        var lastName = req.body.lastName
        if (lastName.length > 30 || lastName.length < 0) {
            return res.status(400).json("Bad lastName")
        }
        if (set != "SET") {
            set += `,`
        }
        set += ` lastName = ${con.escape(lastName)}`
    }

    if (set != "SET") {
        var sql = `UPDATE User ${set} WHERE username = ${con.escape(username)}`
        console.log(sql)

        con.query(sql, function (err, result) {
            console.log(result)
            if (err) {
                console.log(result)
                return res.status(500).json(err)
            }

            res.status(200).json("Updated successfully")
        })
    }
    else {
        res.status(400).json("No attributes detected")
    }
})

module.exports = userRoutes;