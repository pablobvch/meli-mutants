const router = require('express').Router()
const mutant = require('./mutant')
const constant = require('./constant')

const checkMutant = (req, res) => {
  mutant.isMutant(req.body.DNA, (err, data) => {
    if (data == constant.MUTANT) {
      return res.sendStatus(200)
    } else {
      return res.sendStatus(403)
    }
  })
}

const getStats = (req, res) => {
  mutant.getStats((err, data) => {
    res.send(data)
  })
}

router.post('/', checkMutant)

router.get('/stats', getStats)

module.exports = router
