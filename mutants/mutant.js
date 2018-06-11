const numeric = require('numeric')
const Dna = require('./model/dna')
const constant = require('./constant')

function checkDiagonal(listRow){

  const N = listRow.length

  let flow = ""
  /*Get all diagonal*/
  let i = null, j= null

  let listNew = []

  for (let k=0;  k<= N-1; k++)
  {
    i=k
    j=0

    flow=""
    while(i>=0){
       flow += listRow[i][j]
       i = i-1
       j = j+1
    }
    if (flow.length >= constant.MUTANT_PATTERN)
      listNew.push(flow)
  }

  for (let k=1; k<=N-1; k++)
  {
    i=N-1
    j=k
    flow=""
    while(j<= N-1)
    {
       flow += listRow[i][j]
       i=i-1
       j=j+1
    }
    if (flow.length >= constant.MUTANT_PATTERN)
      listNew.push(flow)
  }

  for (let k=0; k<= N-1; k++)
  {
    i=k
    j=N-1 //soy la ultima columna
    flow=""
    while(i>=0){
       flow += listRow[i][j]
       i = i-1
       j = j-1  //tengo que barrer columnas a izquierda, por eso descuento J
    }
    if (flow.length >= constant.MUTANT_PATTERN)
      listNew.push(flow)
  }

  for (let k=N-2; k>=0; k--){
    i=N-1
    j=k
    flow=""
    while(j>=0)
    {
       flow += listRow[i][j]
       i=i-1
       j=j-1
    }
    if (flow.length >= constant.MUTANT_PATTERN)
      listNew.push(flow)
  }
  /*Check new list as accros*/
  being = checkAccros(listNew)

  return being

}

function checkAccros(listRow){
  let being = constant.HUMAN
  listRow.forEach(function(i){
    if ((i.includes(constant.FOUR_A) || i.includes(constant.FOUR_C)|| i.includes(constant.FOUR_G)|| i.includes(constant.FOUR_T))){
      being = constant.MUTANT
      return true
    }})
  return being
}

function checkDown(listRow){
  let being = constant.HUMAN

  /*Traspose matrix*/
  listRow = listRow.map((col, i) => listRow.map(row => row[i]))
  listRow = listRow.map(row => row.join().split(',').join(''))

  being = checkAccros(listRow)

  return being
}

function isValidDNA(listRow){
    const countRowOrColumn = listRow.length
    let valid = true
    listRow.forEach(function(i){
      if(i.length != countRowOrColumn ){
        valid = false
        return true
      }
    })
    return valid
}

function createOrUpdateDNA(data, being, cb) {

  const _isMutant = being == constant.MUTANT ? true: false

  const dna = new Dna(),
        query = { dna: data, isMutant: _isMutant},
        update = {$inc: {'times': 1}},
        //options = { upsert: true, new: true, setDefaultsOnInsert: true }*/
        options = {upsert:true}

  // Find the document
  Dna.findOneAndUpdate(query, update, options, function(error, result) {
    if (error) return
    return cb(null,result)
  })

}

function isMutant(strDNA,cb){

    let being = constant.HUMAN

    const listRow = strDNA.toUpperCase().split(',')

    if (!isValidDNA(listRow))
      return cb(null,constant.INVALID_DNA)

    if(listRow.length < constant.MUTANT_PATTERN)
      return createOrUpdateDNA(strDNA,being,(err,data) =>  {
        return cb(null,being)
      })

    being = checkAccros(listRow)

    if (being == constant.MUTANT)
      return createOrUpdateDNA(strDNA,being,(err,data) =>  {
        return cb(null,being)
      })

    being = checkDown(listRow)

    if (being == constant.MUTANT)
      return createOrUpdateDNA(strDNA,being,(err,data) =>  {
        return cb(null,being)
      })

    being = checkDiagonal(listRow)

    return createOrUpdateDNA(strDNA,being,(err,data) =>  {
      return cb(null,being)
    })
}

function getStats(cb){

  let objJson = {}

  Dna.aggregate([{$match: {isMutant:false} },{ $group: { _id : null, sum : { $sum: "$times" } } }]).exec(function(error,result){
    objJson.count_human_dna = result.length > 0 ? result[0].sum : 0

    Dna.aggregate([{$match: {isMutant:true} },{ $group: { _id : null, sum : { $sum: "$times" } } }]).exec(function(error,result){
      objJson.count_mutant_dna = result.length > 0 ? result[0].sum : 0

      if (objJson.count_human_dna != 0){
          objJson.ratio = objJson.count_mutant_dna/objJson.count_human_dna
      }
      else{
          objJson.ratio = 0
      }

      return cb(null,objJson)
    })
  })
}

module.exports = {
  isMutant,
  getStats
}
