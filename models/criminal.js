const mongoose = require('mongoose');

const criminalSchema = new mongoose.Schema({
  ID: { type: Number, required: true },
  Name: { type: String, required: true },
  Age: { type: Number, required: true },
  Race: { type: String, required: true },
  Crime: { type: String, required: true },
  'Crime Date': { type: Date, required: true },
  'Conviction Date': { type: Date, required: true },
  'Release Date': { type: Date },
  Status: { type: String, required: true },
  'Last Known Location': { type: String, required: true },
  'Risk Level': { type: String, required: true },
  Wanted: { type: String, required: true }
});

// Compile model from schema
const Criminal = mongoose.model('Criminal', criminalSchema);

module.exports = Criminal;