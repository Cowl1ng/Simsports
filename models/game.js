const mongoose = require('mongoose')
const Bet = require('./bet')
const User = require('./User')
defaultBalance = 500

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
  started: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  team_a_goals: {
    type: Number,
  },
  team_b_goals: {
    type: Number,
  },
  yellow_cards: {
    type: Number,
  },
  red_card: {
    type: Boolean,
  },
  mvp: {
    type: String,
  },

})

// Checks for bets on game before allowing it to be deleted
gameSchema.pre('remove', function(next) {
  Bet.find({ game: this.id }, (err, bets) => {
    if (err) {
      next(err)
    } else if(bets.length > 0) {
      next(new Error('This game has bets on it'))
    } else {
      next()
    }
  })
})

gameSchema.post('save', async function(next) {
  Bet.find({ game: this.id }, (error, bets) => {
    var bettype = [this.team_a + " to win", this.team_b + " to win", "draw", "Over " + this.ougoals + " goals", "Under " + this.ougoals + " goals"]
    for (const bet of bets) {
      if(this.completed == true) {
        if(bet.type == bettype[0] & this.team_a_goals > this.team_b_goals) {
          bet.win = true
        } else if(bet.type == bettype[1] & this.team_b_goals > this.team_a_goals) {
          bet.win = true
        } else if(bet.type == bettype[2] & this.team_a_goals == this.team_b_goals) {
          bet.win = true
        } else if(bet.type == bettype[3] & this.team_a_goals + this.team_b_goals > this.ougoals) {
          bet.win = true
        } else if(bet.type == bettype[4] & this.ougoals > this.team_a_goals + this.team_b_goals) {
          bet.win = true
        } else { bet.win = false}
        bet.settled = true
          Bet.findOneAndUpdate({ _id: bet.id} , { win: bet.win, settled: true})
          .catch(err => console.log(err))
      }
    }
  })
  User.find({}, (error, users) => {
    for (const user of users) {
      user.balance = defaultBalance
      winnings = 0
      Bet.find({ user: user.id }, (error, bets) => {
        for (bet of bets) {
          if (bet.settled == true & bet.win == true) {
            winnings += bet.winnings - bet.stake
          } else {
            winnings -= bet.stake
          }
          user.balance += winnings
          winnings = 0
          user.balance = user.balance.toFixed(2)
        }
        User.findOneAndUpdate({ _id: user.id} , { balance: user.balance})
        .catch(err => console.log(err))
      })
    }
  })
})

const Game = mongoose.model('Game', gameSchema)
module.exports = Game