const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
var mysql = require('mysql');

require('dotenv').config();

//app
const app = express();

//middlewares
app.use(bodyParser.json());
app.use(cors());

//routes middleware
app.use('/api', require('./routes/users'))
app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/dummy'))

//Serve static assets if in production. DON'T DELETE
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('../client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});