const constants = require('./constants')

const rootRequest = function(req, res) {
  res.send('Hello World! This is the API REST for Meli-Mutants')
}

const initProcess = function(port) {
  console.log(`App listening on port ${port}!`)
}

const init = function() {
  const express = require('express')
  const app = express()
  const bodyParser = require('body-parser')
  const apirouter = require('./routers')
  const port = process.env.PORT || constants.PORT
  //enviroment variables
  require('dotenv').config()

  //init database
  require('./db/config').init()

  //using bodyParser
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  //using router
  app.use('/api', apirouter)

  //set https attributes
  if (process.env.NODE_ENV !== 'development') {
    const secure = require('express-force-https')
    app.use(secure)
  }

  app.get('/', rootRequest)
  app.listen(port, initProcess(port))
}

module.exports = {
  init
}
