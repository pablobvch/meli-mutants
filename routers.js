var router = require('express').Router()
var mutantRouter = require('./mutants/router')

router.use('/mutants', mutantRouter)

module.exports = router
