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

//Stubbing email sending
var globalEmailSent
const transporter = {
    sendMail: (data, callback) => {
        globalEmailSent = data
        const err = new Error('some error')
        callback(err, null)
    },
}

sinon.stub(nodemailer, 'createTransport').returns(transporter)

//Clean testing database
const testQueries = require('./testqueries')
testQueries.cleanDatabase()

//To clean stubs after each test
beforeEach(async () => {
    await testQueries.cleanDatabase()
})

const app = require('./testapp')

//User Story 15
describe('Password Recovery', () => {
    it('Successfully sends link to an email', async () => {
        const email = 'verifiedemail'

        await testQueries.createVerifiedUser('username', email, 'password')

        let result = await request(app)
            .put('/api/passwordRecoveryLink')
            .send({ email: email })

        try {
            let token = JSON.stringify(globalEmailSent)
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

    it('JWT in email used to succesfully recover password', async () => {
        const email = 'verifiedemail'
        const username = 'username'
        const oldPassword = 'oldPassword'
        const newPassword = 'newPassword'

        await testQueries.createVerifiedUser(username, email, oldPassword)

        var result = await request(app)
            .put('/api/passwordRecoveryLink')
            .send({ email: email })

        try {
            let token = JSON.stringify(globalEmailSent)
            token = token.substring(
                token.indexOf('recovery/') + 9,
                token.indexOf('\\n\\nNote')
            )

            const recoverPassword = await request(app)
                .put('/api/recoverPassword')
                .set('recover_token', token)
                .send({ newPassword: newPassword })

            assert.equal(recoverPassword.statusCode, 200)
            assert.equal(recoverPassword.body, 'Password changed')

            const badPassword = await request(app)
                .post('/api/login')
                .send({ username: username, password: oldPassword })

            assert.equal(badPassword.statusCode, 400)
            assert.equal(badPassword.body, 'Incorrect password')

            const goodPassword = await request(app)
                .post('/api/login')
                .send({ username: username, password: newPassword })

            assert.equal(goodPassword.statusCode, 200)
        } catch (err) {
            assert(false, err)
        }

        assert.equal(result.statusCode, 200)
        assert.equal(result.body, 'Email sent')
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
})

//User Story 18
describe('Password Reset', () => {
    it('Returns failure for curPassword not being correct', (done) => {
        const oldPassword = 'pasword123'
        const newPassword = 'newPassword123'
        const username = 'username'
        const email = 'email'
        const hash = bcrypt.hashSync(oldPassword, 10)
        testQueries.createVerifiedUser(username, email, hash)

        jwt.sign(
            { email: email, username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .put('/api/resetPassword')
                    .set('authorization', token)
                    .send({
                        newPassword: newPassword,
                        curPassword: 'incorrect',
                    })
                    .expect(400)
                    .expect('"Incorrect current password"')
                    .end((err, res) => {
                        if (err) return done(err)
                        return done()
                    })
            }
        )
    })

    it('Returns failure if new password does not comply with requirements', (done) => {
        const hash = bcrypt.hashSync('password', 10)
        testQueries.createVerifiedUser('username', 'email', hash)

        jwt.sign(
            { email: 'email', username: 'username' },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .put('/api/resetPassword')
                    .set('authorization', token)
                    .send({
                        newPassword: 'short',
                        curPassword: 'password',
                    })
                    .expect(400)
                    .expect('"Password does not comply with requirements"')
                    .end((err, res) => {
                        if (err) return done(err)
                        return done()
                    })
            }
        )
    })

    it('Returns failure if missing auth header', (done) => {
        request(app)
            .put('/api/resetPassword')
            .expect(400)
            .expect('"Missing auth token"')
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })

    it('Successfully resets password', (done) => {
        const oldPassword = 'password123'
        const newPassword = 'newPassword123'
        const username = 'username'
        const email = 'email'
        const hash = bcrypt.hashSync(oldPassword, 10)
        testQueries.createVerifiedUser(username, email, hash)

        jwt.sign(
            { email: 'email', username: 'username' },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .put('/api/resetPassword')
                    .set('authorization', token)
                    .send({
                        newPassword: newPassword,
                        curPassword: oldPassword,
                    })
                    .expect(200)
                    .expect('"Password successfully updated"')
                    .end((err, res) => {
                        if (err) return done(err)

                        //Make sure old password doesn't work
                        request(app)
                            .post('/api/login')
                            .send({
                                username: username,
                                password: oldPassword,
                            })
                            .expect(400)
                            .expect('"Incorrect password"')
                            .end((err2, res2) => {
                                if (err2) return done(err2)

                                //Make sure new password works
                                request(app)
                                    .post('/api/login')
                                    .send({
                                        username: username,
                                        password: newPassword,
                                    })
                                    .expect(200)
                                    .end((err3, res3) => {
                                        if (err3) return done(err3)
                                        return done()
                                    })
                            })
                    })
            }
        )
    })
})
