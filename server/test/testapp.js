const request = require('supertest')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.use('/api', require('../routes/auth'))

module.exports = app
