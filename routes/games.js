const express = require('express')
const router = express.Router()
const Game = require('../models/game')
const { ensureAuthenticated } = require('../config/auth')

// All games route
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const games = await Game.find({})
    res.render ('games/index', {games: games})  
  } catch {
      res.redirect('/')
      console.log('Failed')
  }
  
})

router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('games/new', {game: new Game() })
})

//Create game route
router.post('/', ensureAuthenticated, async (req, res) =>{
  console.log('Submitting new game')
  const newGame = new Game ({
    team_a: req.body.team_a,
    odds_a: req.body.odds_a,
    team_b: req.body.team_b,
    odds_b: req.body.odds_b,   
    odds_draw: req.body.odds_draw,
    ougoals: req.body.ougoals,
    odds_ougoals: req.body.odds_ougoals
  })
  try {
    const game_number_max = await Game.find().sort({game_number: -1 }).limit(1)
    var newGameNumber =  +game_number_max[0]['game_number'] + +1
    newGame.game_number = newGameNumber
  } catch {
      console.log('Failed to get max game number')
      newGame.game_number = 1
  }
  // try {
  //   const game_numb = await Game.find().sort({game_number:-1}).limit(1)
  //   console.log('Got game number: ')
  //   console.log(game_numb)
  // } catch {
  //   console.log('Failed to get game number')
  // }
  
  newGame.save()
            .then(game => {
              req.flash('success_msg', 'Game created')
              res.redirect('/games')
            })
            .catch(err => console.log(err))
  // try {
  //   console.log('Saving to database')
  //   const newGame = await game.save()
  //   console.log(newGame)
  //   // res.redirect(`games/${newGame.id}`)
  //   res.redirect(`games`)
  // } catch {
  //   console.log('Error saving to database')
  //   res.render('games/new', {
  //     game: game,
  //     errorMessage: 'Error creating game'
  //   })
  // }
})

module.exports = router
