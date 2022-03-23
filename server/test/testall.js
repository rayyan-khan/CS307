const request = require('supertest')
const assert = require('assert')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')

//Configure environment variables
require('dotenv').config()

//Modules to be stubbed
const decodeAuthHeader = require('../utils/decodeHeader')
const con = require('../database/conn')
const testCon = require('./testconn')

//Use testing database
sinon.stub(con, 'getConObject').returns(testCon)

//Clean testing database
const testQueries = require('./testqueries')
testQueries.cleanDatabase()

//To clean stubs after each test
beforeEach(async () => {
    await testQueries.cleanDatabase()
})

const app = require('./testapp')

describe('GET /api/test-token', () => {
    it('responds', (done) => {
        request(app)
            .get('/api/test-token')
            .expect(200)
            .expect('"false"')
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })
})

//User Story 15
//Recover password endpoint testing
describe('PUT /api/recoverPassword', () => {
    it('Returns failure for missing header', (done) => {
        request(app)
            .put('/api/recoverPassword')
            .expect(400)
            .expect('"Missing recoverToken header"')
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })

    it('Returns failure for missing newPassword field', (done) => {
        request(app)
            .put('/api/recoverPassword')
            .set('recover_token', 'badtoken')
            .expect(400)
            .expect('"Missing newPassword field"')
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })

    it('Returns failure for bad token', (done) => {
        request(app)
            .put('/api/recoverPassword')
            .set('recover_token', 'badtoken')
            .send({ newPassword: 'newPassword' })
            .expect(400)
            .expect('"bad token"')
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })

    it('Returns failure for invalid signature', (done) => {
        jwt.sign({}, 'differentsecret', (err, token) => {
            request(app)
                .put('/api/recoverPassword')
                .set('recover_token', token)
                .send({ newPassword: 'newPassword' })
                .expect(400)
                .expect('"Invalid signature"')
                .end((err, res) => {
                    if (err) return done(err)
                    return done()
                })
        })
    })

    it('Returns failure for expired token', (done) => {
        jwt.sign(
            {},
            process.env.TOKEN_SECRET,
            { expiresIn: 0 },
            (err, token) => {
                request(app)
                    .put('/api/recoverPassword')
                    .set('recover_token', token)
                    .send({ newPassword: 'newPassword' })
                    .expect(400)
                    .expect('"token expired"')
                    .end((err, res) => {
                        if (err) return done(err)
                        return done()
                    })
            }
        )
    })

    it('Returns failure for an invalid signed token', (done) => {
        jwt.sign(
            {},
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .put('/api/recoverPassword')
                    .set('recover_token', token)
                    .send({ newPassword: 'newPassword' })
                    .expect(400)
                    .expect('"Invalid token"')
                    .end((err, res) => {
                        if (err) return done(err)
                        return done()
                    })
            }
        )
    })

    it('Returns failure for nonexistent account', (done) => {
        jwt.sign(
            { email: 'nonexistentemail', purpose: 'password recovery' },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .put('/api/recoverPassword')
                    .set('recover_token', token)
                    .send({ newPassword: 'newPassword' })
                    .expect(400)
                    .expect('"No account with that email"')
                    .end((err, res) => {
                        if (err) return done(err)
                        return done()
                    })
            }
        )
    })

    it('Returns failure for unverified account', (done) => {
        testQueries.createUnverifiedUser(
            'unverifiedusername',
            'unverifiedemail',
            'password',
            123456
        )

        jwt.sign(
            { email: 'unverifiedemail', purpose: 'password recovery' },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .put('/api/recoverPassword')
                    .set('recover_token', token)
                    .send({ newPassword: 'newPassword' })
                    .expect(400)
                    .expect('"Account not verified"')
                    .end((err, res) => {
                        if (err) return done(err)
                        return done()
                    })
            }
        )
    })

    it('Successfully changes password', async () => {
        let newPassword = 'newPassword123'
        let email = 'verifiedEmail'

        //Create a user to change the password for
        await testQueries.createVerifiedUser('username', email, 'oldpassword')

        var token = jwt.sign(
            { email: email, purpose: 'password recovery' },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 }
        )

        const res = await request(app)
            .put('/api/recoverPassword')
            .set('recover_token', token)
            .send({ newPassword: newPassword })

        assert.equal(res.statusCode, 200)
        assert.equal(res.body, 'Password changed')

        let allUsers = await testQueries.allVerifiedUsersByEmail(email)
        let hash = allUsers[0].password

        let isMatch = bcrypt.compareSync(newPassword, hash)

        assert(isMatch, "hashes don't match")
    })
})

describe('PUT /api/passwordRecoveryLink', () => {
    it('Returns failure for nonexistent account', (done) => {
        request(app)
            .put('/api/passwordRecoveryLink')
            .send({ email: 'nonexistent email' })
            .expect(400)
            .expect('"No account with that email"')
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })

    it('Returns failure due to account being unverified', async () => {
        const email = 'unverifiedemail'

        await testQueries.createUnverifiedUser(
            'username',
            email,
            'password',
            123456
        )

        var result = await request(app)
            .put('/api/passwordRecoveryLink')
            .send({ email: email })

        assert.equal(result.statusCode, 400)
        assert.equal(result.body, 'Account not verified')
    })

    it('Successfully sends link to an email', async () => {
        var emailSent

        const transporter = {
            sendMail: (data, callback) => {
                emailSent = data
                const err = new Error('some error')
                callback(err, null)
            },
        }

        sinon.stub(nodemailer, 'createTransport').returns(transporter)

        const email = 'verifiedemail'

        await testQueries.createVerifiedUser('username', email, 'password')

        var result = await request(app)
            .put('/api/passwordRecoveryLink')
            .send({ email: email })

        try {
            let token = JSON.stringify(emailSent)
            token = token.substring(
                token.indexOf('recovery/') + 9,
                token.indexOf('\\n\\nNote')
            )

            let decoded = jwt.verify(token, process.env.TOKEN_SECRET)

            assert.equal(decoded.email, email)
            assert.equal(decoded.purpose, 'password recovery')
        } catch (err) {
            assert(false, err)
        }

        assert.equal(result.statusCode, 200)
        assert.equal(result.body, 'Email sent')
    })
})
