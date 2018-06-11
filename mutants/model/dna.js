const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DnaSchema = new Schema({
  dna: {type: String, required:true},
  isMutant: {type: Boolean, required:true},
  times: { type: Number, default:0}
})

module.exports = mongoose.model('Dna', DnaSchema)
