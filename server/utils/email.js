const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

module.exports.sendVerificationEmail = async (toAddress, confirmationCode) => {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FROM_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        var verificationToken = jwt.sign(
            { email: toAddress, confirmationCode: confirmationCode },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 }
        )

        var mailOptions = {
            from: process.env.EMAIL_FROM_USERNAME,
            to: toAddress,
            subject: 'PurdueCircle- Verification Link',
            text:
                `Please click this link to verify your account\n\n${process.env.EMAIL_BASE_URL}/verification/` +
                verificationToken +
                '\n\nNote: If you were not expecting this email, rut-roh.',
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) reject(err)
            else resolve(info)
        })
    })
}

module.exports.sendPasswordRecoveryEmail = async (toAddress) => {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FROM_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        var recoveryToken = jwt.sign(
            { email: toAddress, purpose: 'password recovery' },
            process.env.TOKEN_SECRET,
            { expiresIn: 3600 }
        )

        var mailOptions = {
            from: process.env.EMAIL_FROM_USERNAME,
            to: toAddress,
            subject: 'PurdueCircle- Password Recovery Link',
            text:
                `Please click this link below to recover your password\n\n${process.env.EMAIL_BASE_URL}/recovery/` +
                recoveryToken +
                '\n\nNote: If you were not expecting this email, rut-roh.',
        }

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) reject(err)
            else resolve(info)
        })
    })
}
