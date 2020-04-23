const mongoose = require('mongoose')
// const Bet = require('./bet')

// Create new schema (tables in sql database)
const gameSchema = new mongoose.Schema ({
  team_a: {
    type: String,
    required: true
  },
  odds_a: {
    type: Number,
    required: true
  },
  team_b: {
    type: String,
    required: true
  },
  odds_b: {
    type: Number,
    required: true
  },
  draw: {
    type: Boolean,
  },
  odds_draw: {
    type: Number,
    required: true
  },
  ougoals: {
    type: Number,
  },
  odds_ogoals: {
    type: Number,
  },
  odds_ugoals: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now
  },
  complete: {
    type: Boolean,
    default: false
  }
})

// // Checks for bets on game before allowing it to be deleted
// gameSchema.pre('remove', function(next) {
//   Bet.find({ game: this.id }, (err, bets) => {
//     if (err) {
//       next(err)
//     } else if(bets.length > 0) {
//       next(new Error('This game has bets on it'))
//     } else {
//       next()
//     }
//   })
// })

const Game = mongoose.model('Game', gameSchema)
module.exports = Game