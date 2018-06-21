const router = require('express').Router()
const mutantRouter = require('./db/entities/mutants/router')

router.use('/mutants', mutantRouter)

module.exports = router
