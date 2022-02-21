const express = require('express')
const authRoutes = express.Router()
const isEmpty = require('is-empty')
var nodemailer = require('../utils/email')
var query = require('../database/queries/authQueries')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const decodeHeader = require('../utils/decodeHeader')


authRoutes.route("/test-token/").get(async function (req, res) {
    var user;
    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.json('false')
    }

    res.json('true')
});

authRoutes.route('/register').post(async (req, res) => {
    const { email, username, password } = req.body

    //Ensure all fields required are present
    if (!email) {
        errors.email = 'Missing email'
    }

    if (!username) {
        errors.username = 'Missing username'
    }

    if (!password) {
        errors.password = 'Missing password'
    }

    if (!isEmpty(errors)) {
        return res.status(400).json(errors)
    }

    if (password.length < 8) {
        return res.status(400).json('Password too short.')
    }

    //Ensure email and username aren't already taken
    var validAccountQueries = [
        await query
            .allUnverifiedUsersByEmail(email)
            .catch((err) => console.log(err)),
        await query
            .allVerifiedUsersByEmail(email)
            .catch((err) => console.log(err)),
        await query
            .allUnverifiedUsersByUsername(username)
            .catch((err) => console.log(err)),
        await query
            .allVerifiedUsersByUsername(username)
            .catch((err) => console.log(err)),
    ]

    var invalidErrors = [
        'Invalid email: Exists for an unverified account',
        'Invalid email: Exists for a verified account',
        'Invalid username: Exists for an unverified account',
        'Invalid username: Exists for a verified account',
    ]

    var errors = []

    //Go through results of queries to check if username or email is taken
    for (var i = 0; i < 4; i++) {
        if (!validAccountQueries[i]) {
            return res.status(500).json('Error executing MySQL statement')
        }

        if (validAccountQueries[i].length != 0) {
            errors.push(invalidErrors[i])
        }
    }

    //If username or email taken, return error
    if (errors.length != 0) {
        var errResult = { errors: errors }
        return res.status(400).json(errResult)
    }

    var confirmationCode = Math.floor(100000 + Math.random() * 900000)

    nodemailer
        .sendVerificationEmail(email, confirmationCode)
        .then((data) => {
            bcrypt.genSalt(10, async (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json('Error hashing password')
                    }

                    var result = await query
                        .createUnverifiedUser(
                            username,
                            email,
                            hash,
                            confirmationCode
                        )
                        .catch((err) => {
                            console.log(err)
                            return res.status(500).json(err)
                        })

                    if (!result) {
                        return res
                            .status(500)
                            .json(
                                'Error when trying to create unverfied account'
                            )
                    }

                    return res.json('Successfully created an unverified acount')
                })
            })
        })
        .catch((err) => {
            console.log(err)
            return res
                .status(500)
                .json(
                    'Unable to register user due to internal error when sending verification email.'
                )
        })
})

authRoutes.route('/resend-email/:email').get(async (req, res) => {
    var result = await query
        .getConfirmationCode(req.params.email)
        .catch((err) => {
            console.log(err)
        })

    if (!result) {
        res.status(500).json('Error trying to access unverified account')
    } else if (result.length == 0) {
        var verifiedResult = await query.allVerifiedUsersByEmail(
            req.params.email
        )
        if (!verifiedResult)
            res.status(500).json('Error trying to access verified account')
        else if (verifiedResult.length != 0)
            res.status(400).json('Account with email already verified')
        else
            res.status(400).json(
                'No account is associated with specified email'
            )
    } else if (result.length > 1) {
        res.status(500).json('Multiple unverified accounts with same email')
    } else {
        nodemailer.sendVerificationEmail(
            req.params.email,
            result[0].confirmationCode
        )
        res.json('Verification link resent')
    }
})

authRoutes.route('/verify/:token').get(async (req, res) => {
    jwt.verify(
        req.params.token,
        process.env.TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                res.status(500).json({ errors: err })
                return
            }

            const { email, confirmationCode } = decoded

            if (!email || !confirmationCode) {
                res.status(400).json('Invalid verification token')
                return
            }

            var verifyResult = await query
                .verifyConfirmationCode(email, confirmationCode)
                .catch((err) => {
                    console.log(err)
                })

            if (!verifyResult) {
                res.status(500).json(
                    'Error attempting to verify confirmation code'
                )
            } else if (verifyResult.length == 1) {
                //Email and confirmation code pair exist
                var createResult = await query
                    .createVerifiedUser(
                        verifyResult[0].username,
                        verifyResult[0].email,
                        verifyResult[0].password
                    )
                    .catch((err) => console.log(err))

                if (!createResult) {
                    res.status(500).json(
                        'Error attempting to create verified account'
                    )
                } else {
                    var deleteResult = await query
                        .deleteUnverifiedUser(verifyResult[0].username)
                        .catch((err) => console.log(err))

                    if (!deleteResult) {
                        res.status(500).json(
                            'Error attempting to delete unverified account'
                        )
                    } else {
                        //Return auth token
                        var getUser = await query.allVerifiedUsersByEmail(email)

                        var username = getUser[0].username

                        const payload = { email: email, username: username }
                        jwt.sign(
                            payload,
                            process.env.TOKEN_SECRET,
                            { expiresIn: 10800 },
                            (err, token) => {
                                if (err) {
                                    console.log(err)
                                    res.json(500).json(
                                        'Error creating auth token'
                                    )
                                } else res.json({ token: token })
                            }
                        )
                    }
                }
            } else {
                //Either incorrect confirmation code or email doesn't exist
                var correctEmail = await query
                    .allUnverifiedUsersByEmail(email)
                    .catch((err) => console.log(err))

                if (!correctEmail)
                    res.status(500).json(
                        'Error attempting to find unverified email'
                    )
                else if (correctEmail.length == 0) {
                    var alreadyVerified = await query
                        .allVerifiedUsersByEmail(email)
                        .catch((err) => console.log(err))

                    if (!alreadyVerified)
                        res.status(500).json(
                            'Error attempting to find verified email'
                        )
                    else if (alreadyVerified.length == 1)
                        res.status(400).json('Account already verified')
                    else
                        res.status(400).json(
                            'No account exists with specified email'
                        )
                } else {
                    res.status(400).json('Incorrect confirmation code')
                }
            }
        }
    )
})

authRoutes.route('/login').post(async (req, res) => {
    let { username, password } = req.body

    errors = []

    if (!username) errors.push('Missing username field')
    if (!password) errors.push('Missing password field')

    if (errors.length != 0) {
        return res.status(400).json({ errors: errors })
    }

    var result = await query
        .allVerifiedUsersByUsername(username)
        .catch((err) => console.log(err))

    if (!result) {
        return res.status(500).json('Error executing MySQL statement')
    } else if (result.length == 0) {
        var unverifiedResult = await query
            .allUnverifiedUsersByUsername(username)
            .catch((err) => console.log(err))

        if (!unverifiedResult)
            return res.status(500).json('Error executing MySQL statement')
        else if (unverifiedResult.length != 0)
            return res.status(400).json('Unverified account')
        else
            return res
                .status(400)
                .json('No account with specified username exists')
    } else {
        bcrypt.compare(password, result[0].password).then((isMatch) => {
            console.log(password)
            console.log(result[0])
            if (!isMatch) return res.status(400).json('Incorrect password')

            const payload = {
                email: result[0].email,
                username: result[0].username,
            }
            jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { expiresIn: 10800 },
                (err, token) => {
                    if (err) {
                        console.log(err)
                        res.json(500).json('Error creating auth token')
                    } else res.json({ token: token })
                }
            )
        })
    }
})

module.exports = authRoutes
