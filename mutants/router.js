const router = require('express').Router()
const mutant = require('./mutant')
const constant = require('./constant')

router.post('/', function(req, res) {

   mutant.isMutant(req.body.DNA, (err,data)=>{
      if (data == constant.MUTANT)
      {
        return res.sendStatus(200)
      }else{
        return res.sendStatus(403)
      }
   })

})

router.post('/stats', function(req, res) {
  
})

module.exports = router
