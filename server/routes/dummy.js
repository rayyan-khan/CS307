const express = require('express');
const dummyRoutes = express.Router();
const jwt = require('jsonwebtoken');

dummyRoutes.route("/test-token").get(async (req, res) => {
    var token = req.headers.authorization;

    if (!token) {
        res.json('No header')
    } else {
        const user = jwt.decode(token);

        if (!user) {
            res.json('messed up token')
        } else {
            res.json(user)
        }
    }
});

module.exports = dummyRoutes;