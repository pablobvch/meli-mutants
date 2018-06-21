const numeric = require('numeric')
const Dna = require('./model/dna')
const constant = require('./constant')
const matrixOperations = require('../../../utilities/matrix')

const checkDiagonal = listRow => {
  const N = listRow.length

  let flow = ''

  /*Get all diagonal*/
  let i = null;

  let j = null;

  let listNew = []

  for (let k = 0; k <= N - 1; k++) {
    i = k
    j = 0

    flow = ''
    while (i >= 0) {
      flow += listRow[i][j]
      i = i - 1
      j = j + 1
    }
    if (flow.length >= constant.MUTANT_PATTERN) listNew.push(flow)
  }

  for (let k = 1; k <= N - 1; k++) {
    i = N - 1
    j = k
    flow = ''
    while (j <= N - 1) {
      flow += listRow[i][j]
      i = i - 1
      j = j + 1
    }
    if (flow.length >= constant.MUTANT_PATTERN) listNew.push(flow)
  }

  for (let k = 0; k <= N - 1; k++) {
    i = k
    j = N - 1 //soy la ultima columna
    flow = ''
    while (i >= 0) {
      flow += listRow[i][j]
      i = i - 1
      j = j - 1 //tengo que barrer columnas a izquierda, por eso descuento J
    }
    if (flow.length >= constant.MUTANT_PATTERN) listNew.push(flow)
  }

  for (let k = N - 2; k >= 0; k--) {
    i = N - 1
    j = k
    flow = ''
    while (j >= 0) {
      flow += listRow[i][j]
      i = i - 1
      j = j - 1
    }
    if (flow.length >= constant.MUTANT_PATTERN) listNew.push(flow)
  }
  
  /*Check new list as accros*/
  being = checkAccros(listNew)

  return being
}

const checkAccros = listRow => {
  let being = constant.HUMAN
  listRow.forEach(function(i) {
    if (
      i.includes(constant.FOUR_A) ||
      i.includes(constant.FOUR_C) ||
      i.includes(constant.FOUR_G) ||
      i.includes(constant.FOUR_T)
    ) {
      being = constant.MUTANT
      return true
    }
  })
  return being
}

const checkDown = listRow => {
  let being = constant.HUMAN

  listRow = matrixOperations.trasposeMatrix(listRow)

  being = checkAccros(listRow)

  return being
}

const isValidDNA = listRow => {
  const countRowOrColumn = listRow.length
  let valid = true
  listRow.forEach(i => {
    if (i.length != countRowOrColumn) {
      valid = false
      return true
    }
  })
  return valid
}

const createOrUpdateDNA = (data, being, cb) => {
  
  const _isMutant = being == constant.MUTANT ? true : false
  const dna = new Dna();
  const query = { dna: data, isMutant: _isMutant };
  const update = { $inc: { times: 1 } };
  const options = { upsert: true };

  // Find the document
  Dna.findOneAndUpdate(query, update, options, (error, result) => {
    if (error) return
    return cb(null, result)
  })
}

const isMutant = (strDNA, cb) => {
  let being = constant.HUMAN

  const listRow = strDNA.toUpperCase().split(',')

  if (!isValidDNA(listRow)) return cb(null, constant.INVALID_DNA)

  if (listRow.length < constant.MUTANT_PATTERN)
    return createOrUpdateDNA(strDNA, being, (err, data) => {
      return cb(null, being)
    })

  being = checkAccros(listRow)

  if (being == constant.MUTANT)
    return createOrUpdateDNA(strDNA, being, (err, data) => {
      return cb(null, being)
    })

  being = checkDown(listRow)

  if (being == constant.MUTANT)
    return createOrUpdateDNA(strDNA, being, (err, data) => {
      return cb(null, being)
    })

  being = checkDiagonal(listRow)

  return createOrUpdateDNA(strDNA, being, (err, data) => {
    return cb(null, being)
  })
}

const getStats = cb => {
  let objJson = {}

  Dna.aggregate([
    { $match: { isMutant: false } },
    { $group: { _id: null, sum: { $sum: '$times' } } }
  ]).exec((error, result) => {
    objJson.count_human_dna = result.length > 0 ? result[0].sum : 0

    Dna.aggregate([
      { $match: { isMutant: true } },
      { $group: { _id: null, sum: { $sum: '$times' } } }
    ]).exec((error, result) => {
      objJson.count_mutant_dna = result.length > 0 ? result[0].sum : 0

      if (objJson.count_human_dna != 0) {
        objJson.ratio = objJson.count_mutant_dna / objJson.count_human_dna
      } else {
        objJson.ratio = 0
      }

      return cb(null, objJson)
    })
  })
}

module.exports = {
  isMutant,
  getStats
}
