const express = require('express');
const authRoutes = express.Router();
const isEmpty = require('is-empty');
var nodemailer = require('../utils/email');
var query = require('../database/queries/authQueries');
const jwt = require('jsonwebtoken');

authRoutes.route("/register").post(async (req, res) => {
    const { email, username, password } = req.body

    //Ensure all fields required are present
    if (!email) {
        errors.email = "Missing email"
    }

    if (!username) {
        errors.username = "Missing username"
    }

    if (!password) {
        errors.password = "Missing password"
    }

    if (!isEmpty(errors)) {
        res.status(400).json(errors)
        return;
    }

    //Ensure email and username aren't already taken
    var validAccountQueries = [
        await query.allUnverifiedUsersByEmail(email).catch((err) => console.log(err)),
        await query.allVerifiedUsersByEmail(email).catch((err) => console.log(err)),
        await query.allUnverifiedUsersByUsername(username).catch((err) => console.log(err)),
        await query.allVerifiedUsersByUsername(username).catch((err) => console.log(err))
    ]

    var invalidErrors = [
        'Invalid email: Exists for an unverified account',
        'Invalid email: Exists for a verified account',
        'Invalid username: Exists for an unverified account',
        'Invalid username: Exists for a verified account'
    ]

    var errors = [];

    //Go through results of queries to check if username or email is taken
    for (var i = 0; i < 4; i++) {
        if (!validAccountQueries[i]) {
            res.status(500).json('Error executing MySQL statement')
            return;
        }

        if (validAccountQueries[i].length != 0) {
            errors.push(invalidErrors[i])
        }
    }

    //If username or email taken, return error
    if (errors.length != 0) {
        var errResult = { 'errors': errors };
        res.status(400).json(errResult)
        return;
    }

    var confirmationCode = Math.floor(100000 + Math.random() * 900000);

    var result = await query.createUnverifiedUser(username, email, password, confirmationCode).catch((err) => {
        console.log(err);
    })

    if (!result) {
        res.status(500).json('Error when trying to create unverfied account')
        return;
    }

    nodemailer.sendVerificationEmail(email, confirmationCode)

    res.json("Successfully created an unverified acount")
});

authRoutes.route("/verify/:token").get(async (req, res) => {
    jwt.verify(req.params.token, process.env.TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            res.status(500).json({ errors: err });
            return;
        }

        const { email, confirmationCode } = decoded;

        if (!email || !confirmationCode) {
            res.status(400).json('Invalid verification token');
            return;
        }

        var verifyResult = await query.verifyConfirmationCode(email, confirmationCode).catch(err => { console.log(err) });

        if (!verifyResult) {
            res.status(500).json('Error attempting to verify confirmation code')
        } else if (verifyResult.length == 1) {
            //Email and confirmation code pair exist
            var createResult = await query.createVerifiedUser(verifyResult[0].username,
                verifyResult[0].email, verifyResult[0].password)
                .catch(err => console.log(err))

            if (!createResult) {
                res.status(500).json('Error attempting to create verified account')
            } else {
                var deleteResult = await query.deleteUnverifiedUser(verifyResult[0].username).catch(err => console.log(err))

                if (!deleteResult) {
                    res.status(500).json('Error attempting to delete unverified account')
                } else {
                    res.json('Account verified')
                }
            }
        } else {
            //Either incorrect confirmation code or email doesn't exist
            var correctEmail = await query.allUnverifiedUsersByEmail(email).catch(err => console.log(err))

            if (!correctEmail) res.status(500).json('Error attempting to find unverified email')
            else if (correctEmail.length == 0) {
                var alreadyVerified = await query.allVerifiedUsersByEmail(email).catch(err => console.log(err))

                if (!alreadyVerified) res.status(500).json('Error attempting to find verified email')
                else if (alreadyVerified.length == 1) res.status(400).json('Account already verified')
                else res.status(400).json('No account exists with specified email')
            } else {
                res.status(400).json('Incorrect confirmation code')
            }
        }
    })
})

authRoutes.route("/login").post(async (req, res) => {
    jwt.verify(req.body.token, process.env.TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(400).json('Error decoding token')
            return;
        }

        const { username, password } = decoded

        if (!username || !password) {
            res.status(400).json('Missing fields')
            return;            
        }

        console.log(decoded)
    })
})

module.exports = authRoutes;