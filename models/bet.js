const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  type: {
    type: String,
    // required: true
  },
  stake: {
    type: Number,
    // required: true
  },
  win: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'User'
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: 'Game'
  }

})

const Bet = mongoose.model('Bet', BetSchema)

module.exports = Bet