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

//User Story 1
describe('Deleting Posts', () => {
    it('Post is deleted', (done) => {
        const user1 = 'username1'
        const email1 = 'email1'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, email1, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user1, postCaption1, anonymous1)

        jwt.sign(
            { email: email1, username: user1 },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/deletePost`)
                    .set('authorization', token)
                    .send({ postID: postID1 })
                    .expect(200)
                    .expect('"Successfully deleted post"')
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM Post WHERE postID = "${postID1}"`

                        testCon.query(sql, (err, res) => {
                            assert.equal(res.length, 0)

                            return done()
                        })
                    })
            }
        )
    })

    it('Post only deleted by post author', (done) => {
        const user1 = 'username1'
        const email1 = 'email1'

        const user2 = 'username2'
        const email2 = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, email1, hash)
        testQueries.createVerifiedUser(user2, email2, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user1, postCaption1, anonymous1)

        jwt.sign(
            { email: email2, username: user2 },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/deletePost`)
                    .set('authorization', token)
                    .send({ postID: postID1 })
                    .expect(400)
                    .expect('"User is not creator of post"')
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM Post WHERE postID = "${postID1}"`

                        testCon.query(sql, (err, res) => {
                            assert.equal(res.length, 1)

                            return done()
                        })
                    })
            }
        )
    })

    it('Comments deleted when a post is deleted', (done) => {
        const user1 = 'username1'
        const email1 = 'email1'

        const user2 = 'username2'
        const email2 = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, email1, hash)
        testQueries.createVerifiedUser(user2, email2, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user1, postCaption1, anonymous1)

        jwt.sign(
            { email: email1, username: user1 },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/createComment`)
                    .set('authorization', token)
                    .send({
                        postID: postID1,
                        username: user1,
                        comment: 'comment',
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM Comments WHERE postID = "${postID1}"`

                        testCon.query(sql, (err, res) => {
                            assert.equal(res.length, 1)

                            request(app)
                                .post(`/api/deletePost`)
                                .set('authorization', token)
                                .send({ postID: postID1 })
                                .expect(200)
                                .expect('"Successfully deleted post"')
                                .end((err, res) => {
                                    if (err) return done(err)

                                    let sql = `SELECT * FROM Comments WHERE postID = "${postID1}"`

                                    testCon.query(sql, (err, res) => {
                                        assert.equal(res.length, 0)

                                        return done()
                                    })
                                })
                        })
                    })
            }
        )
    })

    it('Likes deleted when a post is deleted', (done) => {
        const user1 = 'username1'
        const email1 = 'email1'

        const user2 = 'username2'
        const email2 = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, email1, hash)
        testQueries.createVerifiedUser(user2, email2, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user1, postCaption1, anonymous1)

        jwt.sign(
            { email: email1, username: user1 },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/likeupdate`)
                    .set('authorization', token)
                    .send({
                        postID: postID1,
                        username: user1,
                        table: 'UserLike',
                    })
                    .expect(200)
                    .expect({
                        value: 'Added',
                    })
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM UserLike WHERE postID = "${postID1}"`

                        testCon.query(sql, (err, res) => {
                            assert.equal(res.length, 1)

                            request(app)
                                .post(`/api/deletePost`)
                                .set('authorization', token)
                                .send({ postID: postID1 })
                                .expect(200)
                                .expect('"Successfully deleted post"')
                                .end((err, res) => {
                                    if (err) return done(err)

                                    let sql = `SELECT * FROM UserLike WHERE postID = "${postID1}"`

                                    testCon.query(sql, (err, res) => {
                                        assert.equal(res.length, 0)

                                        return done()
                                    })
                                })
                        })
                    })
            }
        )
    })

    it('Dislikes deleted when a post is deleted', (done) => {
        const user1 = 'username1'
        const email1 = 'email1'

        const user2 = 'username2'
        const email2 = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, email1, hash)
        testQueries.createVerifiedUser(user2, email2, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user1, postCaption1, anonymous1)

        jwt.sign(
            { email: email1, username: user1 },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/likeupdate`)
                    .set('authorization', token)
                    .send({
                        postID: postID1,
                        username: user1,
                        table: 'UserDisLike',
                    })
                    .expect(200)
                    .expect({
                        value: 'Added',
                    })
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM UserDisLike WHERE postID = "${postID1}"`

                        testCon.query(sql, (err, res) => {
                            assert.equal(res.length, 1)

                            request(app)
                                .post(`/api/deletePost`)
                                .set('authorization', token)
                                .send({ postID: postID1 })
                                .expect(200)
                                .expect('"Successfully deleted post"')
                                .end((err, res) => {
                                    if (err) return done(err)

                                    let sql = `SELECT * FROM UserDisLike WHERE postID = "${postID1}"`

                                    testCon.query(sql, (err, res) => {
                                        assert.equal(res.length, 0)

                                        return done()
                                    })
                                })
                        })
                    })
            }
        )
    })
})

//User Story 2
describe('Deleting Users', () => {
    it('User profile is deleted', (done) => {
        const user1 = 'username1'
        const user1Email = 'email1'
        const deleteUser = 'username2'
        const deleteEmail = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, user1Email, hash)
        testQueries.createVerifiedUser(deleteUser, deleteEmail, hash)

        jwt.sign(
            { email: deleteEmail, username: deleteUser },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .get(`/api/deleteProfile`)
                    .set('authorization', token)
                    .expect(200)
                    .expect('"Successfully deleted user"')
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM User WHERE username = "${deleteUser}"`

                        testCon.query(sql, (err, res) => {
                            assert.equal(res.length, 0)

                            return done()
                        })
                    })
            }
        )
    })

    it('Posts by user are deleted when user is deleted', (done) => {
        const deleteUser = 'username2'
        const deleteEmail = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(deleteUser, deleteEmail, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(
            postID1,
            tagID1,
            deleteUser,
            postCaption1,
            anonymous1
        )

        jwt.sign(
            { email: deleteEmail, username: deleteUser },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .get(`/api/deleteProfile`)
                    .set('authorization', token)
                    .expect(200)
                    .expect('"Successfully deleted user"')
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM Post WHERE postID = "${postID1}"`

                        testCon.query(sql, (err, res) => {
                            assert.equal(res.length, 0)

                            return done()
                        })
                    })
            }
        )
    })

    it('Likes by user are deleted when user is deleted', (done) => {
        const deleteUser = 'username2'
        const deleteEmail = 'email2'
        const poster = 'poster'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(deleteUser, deleteEmail, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(
            postID1,
            tagID1,
            deleteUser,
            postCaption1,
            anonymous1
        )

        jwt.sign(
            { email: deleteEmail, username: deleteUser },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/likeupdate`)
                    .set('authorization', token)
                    .send({
                        postID: postID1,
                        username: deleteUser,
                        table: 'UserLike',
                    })
                    .expect(200)
                    .expect({
                        value: 'Added',
                    })
                    .end((err, res) => {
                        if (err) return done(err)

                        request(app)
                            .get(`/api/deleteProfile`)
                            .set('authorization', token)
                            .expect(200)
                            .expect('"Successfully deleted user"')
                            .end((err, res) => {
                                if (err) return done(err)

                                let sql = `SELECT * FROM UserLike WHERE username = "${deleteUser}"`

                                testCon.query(sql, (err, res) => {
                                    assert.equal(res.length, 0)

                                    return done()
                                })
                            })
                    })
            }
        )
    })

    it('Dislikes by user are deleted when user is deleted', (done) => {
        const deleteUser = 'username2'
        const deleteEmail = 'email2'
        const poster = 'poster'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(deleteUser, deleteEmail, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(
            postID1,
            tagID1,
            deleteUser,
            postCaption1,
            anonymous1
        )

        jwt.sign(
            { email: deleteEmail, username: deleteUser },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/likeupdate`)
                    .set('authorization', token)
                    .send({
                        postID: postID1,
                        username: deleteUser,
                        table: 'UserDisLike',
                    })
                    .expect(200)
                    .expect({
                        value: 'Added',
                    })
                    .end((err, res) => {
                        if (err) return done(err)

                        request(app)
                            .get(`/api/deleteProfile`)
                            .set('authorization', token)
                            .expect(200)
                            .expect('"Successfully deleted user"')
                            .end((err, res) => {
                                if (err) return done(err)

                                let sql = `SELECT * FROM UserDisLike WHERE username = "${deleteUser}"`

                                testCon.query(sql, (err, res) => {
                                    assert.equal(res.length, 0)

                                    return done()
                                })
                            })
                    })
            }
        )
    })

    it('Comments by user are deleted when user is deleted', (done) => {
        const deleteUser = 'username2'
        const deleteEmail = 'email2'
        const poster = 'poster'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(deleteUser, deleteEmail, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'

        testCon.query(
            `INSERT INTO Post Values (${postID1}, ${tagID1}, '${deleteUser}', 0, 0, '${postCaption1}', NOW(), 0, ${anonymous1}, null, null);`,
            (err, res) => {
                jwt.sign(
                    { email: deleteEmail, username: deleteUser },
                    process.env.TOKEN_SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                        request(app)
                            .post(`/api/createComment`)
                            .set('authorization', token)
                            .send({
                                postID: postID1,
                                username: deleteUser,
                                comment: 'comment',
                            })
                            .expect(200)
                            .end((err, res) => {
                                if (err) return done(err)

                                let sql = `SELECT * FROM Comments WHERE username = "${deleteUser}"`

                                testCon.query(sql, (err, res) => {
                                    assert.equal(res.length, 1)

                                    request(app)
                                        .get(`/api/deleteProfile`)
                                        .set('authorization', token)
                                        .expect(200)
                                        .expect('"Successfully deleted user"')
                                        .end((err, res) => {
                                            if (err) return done(err)

                                            let sql = `SELECT * FROM Comments WHERE username = "${deleteUser}"`

                                            testCon.query(sql, (err, res) => {
                                                assert.equal(res.length, 0)

                                                return done()
                                            })
                                        })
                                })
                            })
                    }
                )
            }
        )
    })

    it('A deleted user should not be shown as following another user', (done) => {
        const deleteUser = 'deleteusername'
        const deleteEmail = 'deleteemail'
        const user2 = 'user2'
        const email2 = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(deleteUser, deleteEmail, hash)
        testQueries.createVerifiedUser(user2, email2, hash)

        jwt.sign(
            { email: deleteEmail, username: deleteUser },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/followUser`)
                    .set('authorization', token)
                    .send({
                        followed: user2,
                    })
                    .expect(200)
                    .expect('"Successfully followed user"')
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM UserFollow WHERE follower = "${deleteUser}"`

                        testCon.query(sql, (err, res) => {
                            assert.equal(res.length, 1)

                            request(app)
                                .get(`/api/deleteProfile`)
                                .set('authorization', token)
                                .expect(200)
                                .expect('"Successfully deleted user"')
                                .end((err, res) => {
                                    if (err) return done(err)

                                    let sql = `SELECT * FROM UserFollow WHERE follower = "${deleteUser}"`

                                    testCon.query(sql, (err, res) => {
                                        assert.equal(res.length, 0)

                                        return done()
                                    })
                                })
                        })
                    })
            }
        )
    })

    it('A deleted user should not be shown as being followed another user', (done) => {
        const deleteUser = 'deleteusername'
        const deleteEmail = 'deleteemail'
        const user2 = 'user2'
        const email2 = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(deleteUser, deleteEmail, hash)
        testQueries.createVerifiedUser(user2, email2, hash)

        jwt.sign(
            { email: email2, username: user2 },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/followUser`)
                    .set('authorization', token)
                    .send({
                        followed: deleteUser,
                    })
                    .expect(200)
                    .expect('"Successfully followed user"')
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM UserFollow WHERE followed = "${deleteUser}"`

                        testCon.query(sql, (err, res) => {
                            assert.equal(res.length, 1)

                            request(app)
                                .get(`/api/deleteProfile`)
                                .set('authorization', token)
                                .expect(200)
                                .expect('"Successfully deleted user"')
                                .end((err, res) => {
                                    if (err) return done(err)

                                    let sql = `SELECT * FROM UserFollow WHERE followed = "${deleteUser}"`

                                    testCon.query(sql, (err, res) => {
                                        assert.equal(res.length, 0)

                                        return done()
                                    })
                                })
                        })
                    })
            }
        )
    })
})

//User Story 3
describe('Following/Unfollowing Users', () => {
    it('Following a user successfully', (done) => {
        const followerUsername = 'username1'
        const followerEmail = 'email1'
        const followedUsername = 'username2'
        const followedEmail = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(followerUsername, followerEmail, hash)
        testQueries.createVerifiedUser(followedUsername, followedEmail, hash)

        jwt.sign(
            { email: followerEmail, username: followerUsername },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/followUser`)
                    .set('authorization', token)
                    .send({
                        followed: followedUsername,
                    })
                    .expect(200)
                    .expect('"Successfully followed user"')
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM UserFollow WHERE followed="${followedUsername}" AND follower="${followerUsername}"`

                        testCon.query(sql, (err, res) => {
                            if (err) return done(err)

                            assert.equal(res.length, 1)

                            return done()
                        })
                    })
            }
        )
    })

    it('Unfollowing a user successfully', (done) => {
        const followerUsername = 'username1'
        const followerEmail = 'email1'
        const followedUsername = 'username2'
        const followedEmail = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(followerUsername, followerEmail, hash)
        testQueries.createVerifiedUser(followedUsername, followedEmail, hash)

        jwt.sign(
            { email: followerEmail, username: followerUsername },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/followUser`)
                    .set('authorization', token)
                    .send({
                        followed: followedUsername,
                    })
                    .expect(200)
                    .expect('"Successfully followed user"')
                    .end((err, res) => {
                        if (err) return done(err)

                        request(app)
                            .post(`/api/unfollowUser`)
                            .set('authorization', token)
                            .send({
                                followed: followedUsername,
                            })
                            .expect(200)
                            .expect('"Successfully unfollowed user"')
                            .end((err, res) => {
                                if (err) return done(err)

                                let sql = `SELECT * FROM UserFollow WHERE followed="${followedUsername}" AND follower="${followerEmail}"`

                                testCon.query(sql, (err, res) => {
                                    if (err) return done(err)

                                    assert.equal(res.length, 0)

                                    return done()
                                })
                            })
                    })
            }
        )
    })

    it('Cannot follow a user twice successfully', (done) => {
        const followerUsername = 'username1'
        const followerEmail = 'email1'
        const followedUsername = 'username2'
        const followedEmail = 'email2'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(followerUsername, followerEmail, hash)
        testQueries.createVerifiedUser(followedUsername, followedEmail, hash)

        jwt.sign(
            { email: followerEmail, username: followerUsername },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/followUser`)
                    .set('authorization', token)
                    .send({
                        followed: followedUsername,
                    })
                    .expect(200)
                    .expect('"Successfully followed user"')
                    .end((err, res) => {
                        if (err) return done(err)

                        request(app)
                            .post(`/api/followUser`)
                            .set('authorization', token)
                            .send({
                                followed: followedUsername,
                            })
                            .expect(400)
                            .expect('"Already following that user"')
                            .end((err, res) => {
                                if (err) return done(err)

                                return done()
                            })
                    })
            }
        )
    })
})

//User Story 4
describe('Following/Unfollowing Topics', () => {
    it('Following a tag successfully', (done) => {
        const user = 'username1'
        const email = 'email1'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user, email, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user, postCaption1, anonymous1)

        jwt.sign(
            { email: email, username: user },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/followTag`)
                    .set('authorization', token)
                    .send({
                        tagID: tagID1,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM TagFollow WHERE username="${user}" AND tagID="${tagID1}"`

                        testCon.query(sql, (err, res) => {
                            if (err) return done(err)

                            assert.equal(res.length, 1)

                            return done()
                        })
                    })
            }
        )
    })

    it('Unfollowing a tag successfully', (done) => {
        const user = 'username1'
        const email = 'email1'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user, email, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user, postCaption1, anonymous1)

        jwt.sign(
            { email: email, username: user },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/followTag`)
                    .set('authorization', token)
                    .send({
                        tagID: tagID1,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM TagFollow WHERE username="${user}" AND tagID="${tagID1}"`

                        testCon.query(sql, (err, res) => {
                            if (err) return done(err)

                            assert.equal(res.length, 1)

                            request(app)
                                .post(`/api/unfollowTag`)
                                .set('authorization', token)
                                .send({
                                    tagID: tagID1,
                                })
                                .expect(200)
                                .end((err, res) => {
                                    if (err) return done(err)

                                    let sql = `SELECT * FROM TagFollow WHERE username="${user}" AND tagID="${tagID1}"`

                                    testCon.query(sql, (err, res) => {
                                        if (err) return done(err)

                                        assert.equal(res.length, 0)

                                        return done()
                                    })
                                })
                        })
                    })
            }
        )
    })

    it('Following a tag twice fails', (done) => {
        const user = 'username1'
        const email = 'email1'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user, email, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user, postCaption1, anonymous1)

        jwt.sign(
            { email: email, username: user },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/followTag`)
                    .set('authorization', token)
                    .send({
                        tagID: tagID1,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM TagFollow WHERE username="${user}" AND tagID="${tagID1}"`

                        testCon.query(sql, (err, res) => {
                            if (err) return done(err)

                            assert.equal(res.length, 1)

                            request(app)
                                .post(`/api/followTag`)
                                .set('authorization', token)
                                .send({
                                    tagID: tagID1,
                                })
                                .expect(400)
                                .expect('"Already following tag"')
                                .end((err, res) => {
                                    if (err) return done(err)

                                    return done()
                                })
                        })
                    })
            }
        )
    })

    it('Unfollowing a tag twice fails', (done) => {
        const user = 'username1'
        const email = 'email1'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user, email, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user, postCaption1, anonymous1)

        jwt.sign(
            { email: email, username: user },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/followTag`)
                    .set('authorization', token)
                    .send({
                        tagID: tagID1,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql = `SELECT * FROM TagFollow WHERE username="${user}" AND tagID="${tagID1}"`

                        testCon.query(sql, (err, res) => {
                            if (err) return done(err)

                            assert.equal(res.length, 1)

                            request(app)
                                .post(`/api/unfollowTag`)
                                .set('authorization', token)
                                .send({
                                    tagID: tagID1,
                                })
                                .expect(200)
                                .end((err, res) => {
                                    if (err) return done(err)

                                    request(app)
                                        .post(`/api/unfollowTag`)
                                        .set('authorization', token)
                                        .send({
                                            tagID: tagID1,
                                        })
                                        .expect(400)
                                        .expect('"Not following tag"')
                                        .end((err, res) => {
                                            if (err) return done(err)

                                            return done()
                                        })
                                })
                        })
                    })
            }
        )
    })
})

//User Story 7
describe('Likes/Dislikes', () => {
    it('Liking a post updates properly', (done) => {
        const user1 = 'username1'
        const email1 = 'email1'
        const interactor = 'interactor'
        const interactorEmail = 'interactorEmail'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, email1, hash)
        testQueries.createVerifiedUser(interactor, interactorEmail, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user1, postCaption1, anonymous1)

        jwt.sign(
            { email: interactorEmail, username: interactor },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/likeupdate`)
                    .set('authorization', token)
                    .send({
                        postID: postID1,
                        username: interactor,
                        table: 'UserLike',
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql1 = `SELECT * FROM UserLike WHERE postID = "${postID1}" and username = "${interactor}"`

                        testCon.query(sql1, (err, results) => {
                            if (err) return done(err)
                            assert.equal(results.length, 1)

                            let sql2 = `SELECT likesCount, dislikeCount FROM Post WHERE postID="${postID1}"`

                            testCon.query(sql2, (err, results) => {
                                if (err) return done(err)
                                assert.equal(results[0].likesCount, 1)
                                assert.equal(results[0].dislikeCount, 0)

                                return done()
                            })
                        })
                    })
            }
        )
    })

    it('Disiking a post updates properly', (done) => {
        const user1 = 'username1'
        const email1 = 'email1'
        const interactor = 'interactor'
        const interactorEmail = 'interactorEmail'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, email1, hash)
        testQueries.createVerifiedUser(interactor, interactorEmail, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user1, postCaption1, anonymous1)

        jwt.sign(
            { email: interactorEmail, username: interactor },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/likeupdate`)
                    .set('authorization', token)
                    .send({
                        postID: postID1,
                        username: interactor,
                        table: 'UserDisLike',
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        let sql1 = `SELECT * FROM UserDisLike WHERE postID = "${postID1}" and username = "${interactor}"`

                        testCon.query(sql1, (err, results) => {
                            if (err) return done(err)
                            assert.equal(results.length, 1)

                            let sql2 = `SELECT likesCount, dislikeCount FROM Post WHERE postID="${postID1}"`

                            testCon.query(sql2, (err, results) => {
                                if (err) return done(err)
                                assert.equal(results[0].likesCount, 0)
                                assert.equal(results[0].dislikeCount, 1)

                                return done()
                            })
                        })
                    })
            }
        )
    })

    it('Liking a post updates properly', (done) => {
        const user1 = 'username1'
        const email1 = 'email1'
        const interactor = 'interactor'
        const interactorEmail = 'interactorEmail'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, email1, hash)
        testQueries.createVerifiedUser(interactor, interactorEmail, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'post caption'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user1, postCaption1, anonymous1)

        jwt.sign(
            { email: interactorEmail, username: interactor },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/likeupdate`)
                    .set('authorization', token)
                    .send({
                        postID: postID1,
                        username: interactor,
                        table: 'UserLike',
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        request(app)
                            .post(`/api/likeupdate`)
                            .set('authorization', token)
                            .send({
                                postID: postID1,
                                username: interactor,
                                table: 'UserLike',
                            })
                            .expect(200)
                            .expect({
                                value: 'Deleted',
                            })
                            .end((err, res) => {
                                if (err) return done(err)

                                let sql1 = `SELECT * FROM UserLike WHERE postID = "${postID1}" and username = "${interactor}"`

                                testCon.query(sql1, (err, results) => {
                                    if (err) return done(err)
                                    assert.equal(results.length, 0)

                                    let sql2 = `SELECT likesCount, dislikeCount FROM Post WHERE postID="${postID1}"`

                                    testCon.query(sql2, (err, results) => {
                                        if (err) return done(err)
                                        assert.equal(results[0].likesCount, 0)
                                        assert.equal(results[0].dislikeCount, 0)

                                        return done()
                                    })
                                })
                            })
                    })
            }
        )
    })
})

//User Story 9
describe('Bookmarking posts', () => {
    it('Can bookmark a post', (done) => {
        const user1 = 'username1'
        const email1 = 'email1'
        const interactor = 'interactor'
        const interactorEmail = 'interactorEmail'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, email1, hash)
        testQueries.createVerifiedUser(interactor, interactorEmail, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'comment on me'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user1, postCaption1, anonymous1)

        jwt.sign(
            { email: interactorEmail, username: interactor },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/createBookmark`)
                    .set('authorization', token)
                    .send({
                        postID: postID1,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        request(app)
                            .get(`/api/getBookmarks`)
                            .set('authorization', token)
                            .expect((res) => {
                                let body = res.body

                                assert.equal(body.length, 1)
                                assert.equal(body[0].postID, postID1)
                            })
                            .end((err, res) => {
                                if (err) return done(err)
                                return done()
                            })
                    })
            }
        )
    })
})

//User Story 10
describe('Viewing Post Interactions', () => {
    it('Can get interactions of a user', (done) => {
        const user1 = 'username1'
        const email1 = 'email1'
        const user2 = 'username2'
        const email2 = 'email2'
        const user3 = 'username3'
        const email3 = 'email3'
        const interactor = 'interactor'
        const interactorEmail = 'interactorEmail'

        const password = 'password123'
        const hash = bcrypt.hashSync(password, 10)

        testQueries.createVerifiedUser(user1, email1, hash)
        testQueries.createVerifiedUser(user2, email2, hash)
        testQueries.createVerifiedUser(user3, email3, hash)
        testQueries.createVerifiedUser(interactor, interactorEmail, hash)

        let postID1 = '1'
        let tagID1 = '1'
        let postCaption1 = 'comment on me'
        let anonymous1 = '0'
        testQueries.createPost(postID1, tagID1, user1, postCaption1, anonymous1)

        let postID2 = '2'
        let tagID2 = '2'
        let postCaption2 = 'like me'
        let anonymous2 = '0'
        testQueries.createPost(postID2, tagID2, user2, postCaption2, anonymous2)

        let postID3 = '3'
        let tagID3 = '3'
        let postCaption3 = 'dislike me'
        let anonymous3 = '0'
        testQueries.createPost(postID3, tagID3, user3, postCaption3, anonymous3)

        let lag = 1000

        jwt.sign(
            { email: interactorEmail, username: interactor },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/createComment`)
                    .set('authorization', token)
                    .send({
                        postID: postID1,
                        username: interactor,
                        comment: 'comment',
                    })
                    .expect(200)
                    .end((err, res) => {
                        setTimeout(() => {
                            if (err) return done(err)

                            request(app)
                                .post('/api/likeupdate')
                                .set('authorization', token)
                                .send({
                                    postID: postID2,
                                    username: interactor,
                                    table: 'UserLike',
                                })
                                .expect(200)
                                .end((err, res) => {
                                    setTimeout(() => {
                                        if (err) return done(err)

                                        request(app)
                                            .post('/api/likeupdate')
                                            .set('authorization', token)
                                            .send({
                                                postID: postID3,
                                                username: interactor,
                                                table: 'UserDislike',
                                            })
                                            .expect(200)
                                            .end((err, res) => {
                                                if (err) return done(err)

                                                request(app)
                                                    .get(
                                                        `/api/postInteractions/${interactor}`
                                                    )
                                                    .set('authorization', token)
                                                    .expect(200)
                                                    .expect((req) => {
                                                        let body = req.body
                                                        assert.equal(
                                                            body.length,
                                                            3
                                                        )

                                                        //First interaction should be a dislike
                                                        assert.equal(
                                                            body[0].postID,
                                                            postID3
                                                        )
                                                        assert.equal(
                                                            body[0].comment,
                                                            null
                                                        )
                                                        assert.equal(
                                                            body[0].liked,
                                                            false
                                                        )
                                                        assert.equal(
                                                            body[0].disliked,
                                                            true
                                                        )

                                                        //Second interactions should be a like
                                                        assert.equal(
                                                            body[1].postID,
                                                            postID2
                                                        )
                                                        assert.equal(
                                                            body[1].comment,
                                                            null
                                                        )
                                                        assert.equal(
                                                            body[1].liked,
                                                            true
                                                        )
                                                        assert.equal(
                                                            body[1].disliked,
                                                            false
                                                        )

                                                        //Third interaction should be a commment
                                                        assert.equal(
                                                            body[2].postID,
                                                            postID1
                                                        )
                                                        assert.equal(
                                                            body[2].comment,
                                                            'comment'
                                                        )
                                                        assert.equal(
                                                            body[2].liked,
                                                            false
                                                        )
                                                        assert.equal(
                                                            body[2].disliked,
                                                            false
                                                        )
                                                    })
                                                    .end((err, res) => {
                                                        if (err)
                                                            return done(err)
                                                        return done()
                                                    })
                                            })
                                    }, lag)
                                })
                        }, lag)
                    })
            }
        )
    }).timeout(5000)
})

//User Story 12
describe('Tag page', () => {
    it('Created tagged posts and it is returned when getting all posts with tag', (done) => {
        const password = 'newPassword123'
        const username = 'username'
        const email = 'email'
        const hash = bcrypt.hashSync(password, 10)
        testQueries.createVerifiedUser(username, email, hash)

        let postID = '69'
        let tagID = '420'
        let postCaption = 'caption'
        let anonymous = '0'
        testQueries.createPost(postID, tagID, username, postCaption, anonymous)

        jwt.sign(
            { email: email, username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .get(`/api/getPostWithTag/${tagID}`)
                    .set('authorization', token)
                    .expect(200)
                    .expect((res) => {
                        assert.equal(res.body.length, 1)
                        assert.equal(res.body[0].postID, postID)
                    })
                    .end((err, res) => {
                        if (err) return done(err)
                        return done()
                    })
            }
        )
    })

    it('Does not return posts if tag does not exist', (done) => {
        let nonExistentTagID = '69'
        request(app)
            .get(`/api/getPostWithTag/${nonExistentTagID}`)
            .expect(200)
            .expect((res) => {
                assert.equal(res.body.length, 0)
            })
            .end((err, res) => {
                if (err) return done(err)
                return done()
            })
    })
})

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

//User Story 17
describe('Viewing Anonymous Posts', () => {
    it('A user can see an anymous post they have created', (done) => {
        const password = 'password123'
        const username = 'username'
        const email = 'email'
        const hash = bcrypt.hashSync(password, 10)
        testQueries.createVerifiedUser(username, email, hash)

        let postID = '1'
        let tagID = '1'
        let postCaption = 'anon caption'
        let anonymous = '1'
        testQueries.createPost(postID, tagID, username, postCaption, anonymous)

        jwt.sign(
            { email: email, username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .get(`/api/getPostsByUser/${username}`)
                    .set('authorization', token)
                    .expect(200)
                    .expect((res) => {
                        assert.equal(res.body.length, 1)
                        let post = res.body[0]
                        assert.equal(post.postID, postID)
                        assert.equal(post.username, username)
                        assert.equal(post.postCaption, postCaption)
                    })
                    .end((err, res) => {
                        if (err) return done(err)
                        return done()
                    })
            }
        )
    })

    it('A user cannot view the anonymous post of another user', (done) => {
        const password = 'password123'
        const username = 'username'
        const email = 'email'
        const hash = bcrypt.hashSync(password, 10)
        testQueries.createVerifiedUser(username, email, hash)

        let postID = '1'
        let tagID = '1'
        let postCaption = 'anon caption'
        let anonymous = '1'
        testQueries.createPost(postID, tagID, username, postCaption, anonymous)

        const email2 = 'email2'
        const username2 = 'username2'

        jwt.sign(
            { email: email2, username: username2 },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .get(`/api/getPostsByUser/${username}`)
                    .set('authorization', token)
                    .expect(200)
                    .expect((res) => {
                        assert.equal(res.body.length, 0)
                    })
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

describe('Messaging', () => {
    it('Can send message', (done) => {
        const password = 'password123'
        const username = 'username'
        const email = 'email'
        const hash = bcrypt.hashSync(password, 10)
        testQueries.createVerifiedUser(username, email, hash)

        const password2 = 'password123'
        const username2 = 'username2'
        const email2 = 'email2'
        const hash2 = bcrypt.hashSync(password, 10)
        testQueries.createVerifiedUser(username2, email2, hash2)

        const message = 'This is a message'

        jwt.sign(
            { email: email, username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/messages/sendMessage`)
                    .set('authorization', token)
                    .send({
                        fromUser: username,
                        toUser: username2,
                        message: message,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        const sql = `Select * from Messages where fromUser="${username}" and toUser="${username2}" and message = "${message}"`

                        testCon.query(sql, (err, result) => {
                            if (err) return done(err)

                            assert.equal(result.length, 1)

                            return done()
                        })
                    })
            }
        )
    })
})

describe('Get Active Conversations', () => {
    it('Can get active conversations', (done) => {
        const password = 'password123'
        const username = 'username'
        const email = 'email'
        const hash = bcrypt.hashSync(password, 10)
        testQueries.createVerifiedUser(username, email, hash)

        const password2 = 'password123'
        const username2 = 'username2'
        const email2 = 'email2'
        const hash2 = bcrypt.hashSync(password, 10)
        testQueries.createVerifiedUser(username2, email2, hash2)

        const message = 'This is a message'

        jwt.sign(
            { email: email, username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/messages/sendMessage`)
                    .set('authorization', token)
                    .send({
                        fromUser: username,
                        toUser: username2,
                        message: message,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        request(app)
                            .post(`/api/messages/getConversations`)
                            .set('authorization', token)
                            .expect(200)
                            .end((err, res) => {
                                if (err) return done(err)

                                assert.equal(res.length, 1)

                                return done()
                            })
                    })
            }
        )
    })
})

describe('Get Last Message', () => {
    it('Can get the last message through the conversation', (done) => {
        const password = 'password123'
        const username = 'username'
        const email = 'email'
        const hash = bcrypt.hashSync(password, 10)
        testQueries.createVerifiedUser(username, email, hash)

        const password2 = 'password123'
        const username2 = 'username2'
        const email2 = 'email2'
        const hash2 = bcrypt.hashSync(password, 10)
        testQueries.createVerifiedUser(username2, email2, hash2)

        const message = 'This is a message'
        const message2 = 'This is the second message'

        jwt.sign(
            { email: email, username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                request(app)
                    .post(`/api/messages/sendMessage`)
                    .set('authorization', token)
                    .send({
                        fromUser: username,
                        toUser: username2,
                        message: message,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err)

                        request(app)
                            .post(`/api/messages/sendMessage`)
                            .set('authorization', token)
                            .send({
                                fromUser: username,
                                toUser: username2,
                                message: message2,
                            })
                            .expect(200)
                            .end((err, res) => {
                                if (err) return done(err)

                                request(app)
                                    .post(`/api/messages/getConversations`)
                                    .set('authorization', token)
                                    .expect(200)
                                    .end((err, res) => {
                                        if (err) return done(err)

                                        assert.equal(res.length, 1)
                                        assert.notEqual(res[0].message, undefined)
                                        assert.equal(res[0].message, message2)

                                        return done()
                                    })
                                })
                    })
            }
        )
    })
})