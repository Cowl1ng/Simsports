const mongoose = require('mongoose')

// Create new schema (tables in sql database)
const gameSchema = new mongoose.Schema ({
  team_a: {
    type: String,
    required: true
  },
  team_b: {
    type: String,
    required: true
  },
  odds_a: {
    type: String,
    required: true
  },
  odds_b: {
    type: String,
    required: true
  }
})


module.exports = mongoose.model('Game', gameSchema)