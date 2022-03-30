const express = require('express')
const userRoutes = express.Router()
const decodeHeader = require('../utils/decodeHeader')
const query = require('../database/queries/userQueries')
const authQuery = require('../database/queries/authQueries')

//Use the below line in any file to connect to the database
var getCon = require('../database/conn')
var con = getCon.getConObject()

userRoutes.route('/getUserFromHeader').get(async (req, res) => {
    var user
    try {
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).send(err)
    }

    res.status(200).json(user)
})

userRoutes.route('/deleteProfile').get(async (req, res) => {
    var user
    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user
    var sql = `DELETE FROM User WHERE username = ${con.escape(username)}`
    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json('Successfully deleted user')
    })
})

userRoutes.route('/getNumberFollowing').get(async (req, res) => {
    var user
    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user
    //var sql = `DELETE FROM User WHERE username = ${con.escape(username)}`
    var sql = `Select Count(followed) FROM UserFollow Where follower=${con.escape(username)}`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json('Successfully deleted user')
    })
})
userRoutes.route('/getNumberFollowers').get(async (req, res) => {
    var user
    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user
    //var sql = `DELETE FROM User WHERE username = ${con.escape(username)}`

})

userRoutes.route('/getProfile/:username').get(async (req, res) => {
    var user
    var amUser = false
    try {
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        user = undefined
    }

    if (user != undefined) {
        const { email, username } = user
        if (username == req.params.username) {
            amUser = true
        }
    }

    var sql = `SELECT username, email, bio, private, firstName, lastName, url from User WHERE username = ${con.escape(
        req.params.username
    )}`
    // var sql = `SELECT User.username, User.email, User.bio, User.private, User.firstName, User.lastName, User.url from User, UserFollow WHERE User.username = ${con.escape(
    //     req.params.username
    // )} and `

    con.query(sql, async (err, fullResponse) => {
        if (fullResponse.length === 0)
            return res.status(400).json("User doesn't exist")
        let result = fullResponse[0]
        console.log(result)
        if (err) {
            console.log(result)
            return res.status(500).json(err)
        }
        if (result.private == 1 && !amUser) {
            delete result.email
        }

        let followingUser =
            user &&
            (await query.isUser1FollowingUser2(
                user.username,
                req.params.username
            ))

        var numberFollwersSQL = `Select Count(followed) FROM UserFollow Where followed=${con.escape(req.params.username)}`

        con.query(numberFollwersSQL, function (err, result) {
            if (err) {
                console.log(err)
                res.status(500).json(err)
            } else {
                let numberFollowers = result[0]['Count(followed)'];
                console.log(numberFollowers)

                var numberFollowingSQL = `Select Count(follower) FROM UserFollow Where follower=${con.escape(req.params.username)}`

                con.query(numberFollowingSQL, function (err, result) {
                    if (err) {
                        console.log(err)
                        res.status(500).json(err)
                    } else {
                        let numberFollowing = result[0]['Count(follower)'];
                        console.log(numberFollowing)

                        let numTagsFollowingSQL = `SELECT * FROM TagFollow WHERE username = "${req.params.username}"`

                        con.query(numTagsFollowingSQL, (err, result) => {
                            let numTagsFollowing = result.length

                            res.status(200).json({ ...result, following: followingUser,
                                numberFollowers: numberFollowers,
                                numberFollowing: numberFollowing,
                                numTagsFollowing: numTagsFollowing
                            })
                        })

                    }
                })
            }
        })

    })
})

userRoutes.route('/updateProfile').put(async (req, res) => {
    var user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user
    var set = 'SET'

    if (req.body['bio'] != undefined) {
        var bio = req.body.bio
        if (bio.length > 200 || bio.length < 0) {
            return res.status(400).json('Bad bio')
        }
        if (set != 'SET') {
            set += `,`
        }
        set += ` bio = ${con.escape(bio)}`
    }
    if (req.body['private'] != undefined) {
        var private = req.body.private
        if (private != 0 && private != 1) {
            return res.status(400).json('Bad private')
        }
        if (set != 'SET') {
            set += `,`
        }
        set += ` private = ${con.escape(private)}`
    }
    if (req.body['firstName'] != undefined) {
        var firstName = req.body.firstName
        if (firstName.length > 30 || firstName.length < 0) {
            return res.status(400).json('Bad firstName')
        }
        if (set != 'SET') {
            set += `,`
        }
        set += ` firstName = ${con.escape(firstName)}`
    }
    if (req.body['lastName'] != undefined) {
        var lastName = req.body.lastName
        if (lastName.length > 30 || lastName.length < 0) {
            return res.status(400).json('Bad lastName')
        }
        if (set != 'SET') {
            set += `,`
        }
        set += ` lastName = ${con.escape(lastName)}`
    }

    if (set != 'SET') {
        var sql = `UPDATE User ${set} WHERE username = ${con.escape(username)}`
        console.log(sql)

        con.query(sql, function (err, result) {
            console.log(result)
            if (err) {
                console.log(result)
                return res.status(500).json(err)
            }

            res.status(200).json('Updated successfully')
        })
    } else {
        res.status(400).json('No attributes detected')
    }
})

userRoutes.route('/search/:query').get(async (req, res) => {
    var sql = `SELECT username, firstName, lastName FROM User WHERE locate(${con.escape(
        req.params.query
    )}, username) > 0 OR locate(${con.escape(req.params.query)}, firstName) > 0 OR locate(${con.escape(req.params.query)}, lastName) > 0`

    const name = req.params.query.split(' ')
    if (name.length > 1) {
        sql = `SELECT username, firstName, lastName FROM User WHERE locate(${con.escape(name[0])}, firstName) > 0 and locate(${con.escape(name[1])}, lastName) > 0`
    }

    var sql1 = `SELECT * FROM Tag WHERE locate(${con.escape(
        req.params.query
    )}, tagID) > 0`

    con.query(sql, function (err, result) {
        con.query(sql1, function (err1, result1) {
            if (result1.length === 0 && result.length === 0)
                return res.status(400).json("Nothing such as that exists")
            console.log(result1)
            if (err) {
                console.log(result)
                return res.status(500).json(err)
            }
            if (err1) {
                console.log(result1)
                return res.status(500).json(err1)
            }
            try {
                var list = result.map((user) => {
                    return {
                        value: user.username,
                        label:
                            user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : '',
                        type: 'user',
                    }
                })
    
                return res.status(200).json(list)
            } catch (error) {
                return res.status(400).json(error)
            }
        })
    })
})

userRoutes.route('/followUser').post(async (req, res) => {
    let { followed } = req.body
    if (!followed) {
        return res.status(400).json('Missing followed field')
    }
    var user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user
    if (!email || !username) {
        return res.status('Bad token')
    }

    if (await query.isUser1FollowingUser2(username, followed)) {
        return res.status(400).json('Already following that user')
    }

    if (
        (await authQuery.accountExistsUsername(followed)) !== 'Account exists'
    ) {
        return res.status(400).json('User does not exist')
    }

    var sql = `INSERT INTO UserFollow VALUES (${con.escape(
        followed
    )}, ${con.escape(username)}, NOW())`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json('Successfully followed user')
    })
})

userRoutes.route('/getFollowedUsers').get(async (req, res) => {
    var user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user

    var sql = `SELECT followed FROM UserFollow WHERE follower = ${con.escape(
        username
    )}`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json(result)
    })
})

userRoutes.route('/unfollowUser').post(async (req, res) => {
    let { followed } = req.body
    var user

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    const { email, username } = user

    var sql = `DELETE FROM UserFollow WHERE follower = ${con.escape(
        username
    )} and followed = ${con.escape(followed)}`

    con.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(500).json(err)
        } else res.json('Successfully unfollowed user')
    })
})

module.exports = userRoutes
