const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const apirouter = require('./routers')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', apirouter)

if(process.env.NODE_ENV === 'development')
  {
    require('dotenv').config()
    console.log('Require dotenv')
  }else{
    const secure = require('express-force-https')
    app.use(secure)
}

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)
const port = process.env.PORT || 8080;

app.get('/', function (req, res) {
  res.send('Hello World! This is the API REST for Meli-Mutants')
});

app.listen(port, function () {
  console.log(`App listening on port ${port}!`)
});
