const mongoose = require('mongoose')

// Create new schema (tables in sql database)
const gameSchema = new mongoose.Schema ({
  team_a: {
    type: String,
    required: true
  },
  odds_a: {
    type: String,
    required: true
  },
  team_b: {
    type: String,
    required: true
  },
  odds_b: {
    type: String,
    required: true
  },
  draw: {
    type: Boolean,
  },
  odds_draw: {
    type: String,
    required: true
  },
  ougoals: {
    type: String,
  },
  odds_ougoals: {
    type: String,
  },
  game_number: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  complete: {
    type: Boolean,
    default: false
  },
})

const Game = mongoose.model('Game', gameSchema)
module.exports = Game