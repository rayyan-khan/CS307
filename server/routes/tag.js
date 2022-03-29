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
        let result = fullResponse
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

tagRoutes.route('/getNumberOfTags/:tagName').get(async (req, res) => {
    var sql = `SELECT COUNT(*) as count FROM TagFollow WHERE tagID = ${con.escape(req.params.tagName)}`
    con.query(sql, function (err, fullResponse) {
        let result = fullResponse
        console.log(result)
        if (err) {
            console.log(result)
            return res.status(500).json(err)
        }

        res.status(200).json(result)
    })
})


tagRoutes.route('/followTag').post(async (req, res) => {
    let { tagID } = req.body
    var user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user

    var sql = `INSERT INTO TagFollow VALUES (${con.escape(username)}, ${con.escape(tagID)}, NOW())`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

tagRoutes.route('/getFollowedTags').get(async (req, res) => {
    var user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user

    var sql = `SELECT tagID FROM TagFollow WHERE username = ${con.escape(username)}`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

tagRoutes.route('/unfollowTag').post(async (req, res) => {
    let { tagID } = req.body
    var user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user

    var sql = `DELETE FROM TagFollow WHERE tagID = ${con.escape(tagID)} and username = ${con.escape(username)}`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

tagRoutes.route('/searchTags/:query').get(async (req, res) => {
    var sql = `SELECT * FROM Tag WHERE locate(${con.escape(
        req.params.query
    )}, tagID) > 0`

    con.query(sql, function (err, result) {
        if (result.length === 0)
            return res.status(400).json("Tag don't exist")
        console.log(result)
        if (err) {
            console.log(result)
            return res.status(500).json(err)
        }

        return res.json(result)
    })
})

module.exports = tagRoutes