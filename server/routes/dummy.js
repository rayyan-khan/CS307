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

dummyRoutes.route("/dummy-get-profile/:username").get(async (req, res) => {
    res.json({
        bio: 'Purdue CS \'24. Greek Life baby- Kappa Delta Zeda Sigma Omega Phi Rho',
        numTagsFollowing: 69,
        numFollowers: 999000,
        numFollowing: 420000000
    })
});

module.exports = dummyRoutes;