const express = require('express');
const dummyRoutes = express.Router();
const decodeHeader = require('../utils/decodeHeader')

dummyRoutes.route("/test-token").post(async (req, res) => {
    var user;

    try {
        //Use decodeHeader to extract user info from header or throw an error
        user = await decodeHeader.decodeAuthHeader(req)
    } catch (err) {
        return res.status(400).json(err)
    }

    res.json(user)
});

module.exports = dummyRoutes;