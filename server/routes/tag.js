const express = require('express')
const tagRoutes = express.Router()
const decodeHeader = require('../utils/decodeHeader')

//Use the below line in any file to connect to the database
var getCon = require('../database/conn')
var con = getCon.getConObject()

tagRoutes.route('/getTags').get(async (req, res) => {
    var sql = `SELECT * FROM Tag`

    con.query(sql, function (err, fullResponse) {
        if (fullResponse.length === 0)
            return res.status(400).json("Tags doesn't exist")
        let result = fullResponse[0]
        console.log(result)
        if (err) {
            console.log(result)
            return res.status(500).json(err)
        }

        res.status(200).json(result)
    })
})

tagRoutes.route('/createTag/:tagName').get(async (req, res) => {
    var sql = `INSERT INTO Tag VALUES (${con.escape(req.params.tagName)}, 0)`

    con.query(sql, function (err, fullResponse) {
        if (fullResponse.length === 0)
            return res.status(400).json("Tags doesn't exist")
        let result = fullResponse[0]
        console.log(result)
        if (err) {
            console.log(result)
            return res.status(500).json(err)
        }

        res.status(200).json(result)
    })
})

module.exports = tagRoutes