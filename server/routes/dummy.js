const express = require('express');
const dummyRoutes = express.Router();
const jwt = require('jsonwebtoken');

dummyRoutes.route("/test-token").get(async (req, res) => {
    var token = req.headers.authorization;

    if (!token) {
        res.json('No header')
    } else {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                res.status(500).json({ errors: err });
                return;
            }
    
            const user = decoded;

            if (!user) {
                res.json('messed up token')
            } else {
                res.json(user)
            }
        })

        
    }
});

module.exports = dummyRoutes;