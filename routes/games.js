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
  const game = new Game ({
    team_a: req.body.team_a,
    team_b: req.body.team_b,
    odds_a: req.body.odds_a,
    odds_b: req.body.odds_b
  })
  try {
    const newGame = await game.save()
    console.log(newGame)
    // res.redirect(`games/${newGame.id}`)
    res.redirect(`games`)
  } catch {
    res.render('games/new', {
      game: game,
      errorMessage: 'Error creating game'
    })
  }
})

module.exports = router
