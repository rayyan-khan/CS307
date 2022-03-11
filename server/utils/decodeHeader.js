const jwt = require('jsonwebtoken')

module.exports = {
    decodeAuthHeader: (req) => {
        var token = req.headers.authorization
        if (!token) {
            console.log('no header')
            throw 'No header'
        } else {
            return jwt.verify(
                token,
                process.env.TOKEN_SECRET,
                async (err, decoded) => {
                    if (err) {
                        throw { errors: err }
                    }

                    return decoded
                }
            )
        }
    },
}
