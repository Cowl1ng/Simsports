const express = require('express')
const router = express.Router()
const Game = require('../models/game')
const fantasyGame = require('../models/fantasygame')
const { ensureAuthenticated } = require('../config/auth')
const Bet = require('../models/bet')
const User = require('../models/User')
gameWeek = 1

// All games route
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const fantasygames = await fantasyGame.find({game_week: gameWeek})
    res.render ('fantasy/index', {fantasygames: fantasygames})  
  } catch {
      res.redirect('/')
      console.log('Failed')
  }
  
})
// Public games route
router.get('/list', ensureAuthenticated, async (req, res) => {
  try {
    const fantasygames = await fantasyGame.find({game_week: gameWeek})
    res.render ('fantasy/index_public', {fantasygames: fantasygames})  
  } catch {
      res.redirect('/')
      console.log('Failed')
  }
  
})
// Create bet route
router.post('/list', ensureAuthenticated, async (req, res) =>{
  console.log('Submitting new bet')
  var odds = 0
  try {
    const users = await User.findById(req.user.id)
    const fantasygames = await fantasyGame.findById(req.body.gameid)
    if(req.body.bettype == fantasygames.team_a + " to win") {
      odds = fantasygames.odds_a
    } else if(req.body.bettype == fantasygames.team_b + " to win") {
      odds = fantasygames.odds_b
    } else if(req.body.bettype == "draw") {
      odds = fantasygames.odds_draw
    } else {console.log("Error getting odds")}
    winnings = odds * req.body.stake
    winnings = winnings.toFixed(2)
    const newBet = new Bet ({
      type: req.body.bettype,
      stake: req.body.stake,
      winnings: winnings,
      user: users.id,
      game: req.body.gameid,
      game_title: req.body.game_title
    })
    users.balance -= req.body.stake
    await users.save()
    await newBet.save()
    req.flash('success_msg', 'Bet created')
    res.redirect('/games/list')
  } catch(err) {
      console.log(err)
  }
})

// Show create game  page route
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('fantasy/new', {fantasygame: new fantasyGame() })
})

// Get week change page
router.get('/week', ensureAuthenticated, (req, res) => {
  res.render('fantasy/week', {fantasygame: new fantasyGame() })
})

// Post week change
router.post('/new', ensureAuthenticated, async (req, res) => {
  gameWeek = req.body.game_week
  console.log(req.body.started)
  if(req.body.started == 'true'){ 
    gameStarted = true
  } else { gameStarted = false }
  console.log(gameStarted)
  await fantasyGame.updateMany({game_week: { $lt: gameWeek }}, { $set: { 'completed': true, 'started': gameStarted }})  
  await fantasyGame.updateMany({game_week: { $gte: gameWeek }}, { $set: { 'completed': false, 'started': gameStarted }})
  res.redirect('/fantasy')
})

//Create game route
router.post('/', ensureAuthenticated, async (req, res) =>{
  const newfantasyGame = new fantasyGame ({
    team_a: req.body.team_a,
    odds_a: req.body.odds_a,
    team_b: req.body.team_b,
    odds_b: req.body.odds_b,   
    odds_draw: req.body.odds_draw,
    game_week: req.body.game_week,
    completed : req.body.completed
  })
  newfantasyGame.save()
            .then(fantasygame => {
              req.flash('success_msg', 'Fantasy Game created')
              res.redirect('/fantasy/list')
            })
            .catch(err => console.log(err))
})


// Indivdual game route
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const fantasygame = await fantasyGame.findById(req.params.id)
    const users = await User.findById(req.user.id)
    const userBets = await Bet.find({user: users.id, game: fantasygame.id})
    var bettype = [fantasygame.team_a, fantasygame.team_b, "draw"]
    if(fantasygame.started == false) { 
      res.render('fantasy/show', {
        fantasygame: fantasygame,
        users: users,
        bettype: bettype
      })
    } else if(fantasygame.started == true & fantasygame.completed == false) {
      res.render('fantasy/started', {
        fantasygame: fantasygame,
        users: users,
        userBets: userBets
      })
    } else {
      res.render('fantasy/completed', {
        fantasygame: fantasygame,
        users: users,
        userBets: userBets
      })
    }

  } catch(err) {
    console.log(err)
    res.redirect('/games')
  }
})

// Page to edit betting lines on game
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
    res.render('games/edit', {game: game })
  } catch {
    res.redirect('/games')
  }
  
})

// Page to edit result of game
router.get('/:id/result', ensureAuthenticated, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
    res.render('fantasy/result', {fantasygame: fantasygame })
  } catch {
    res.redirect('/fantasy')
  }
  
})
// Request to edit result of game in mongodb
router.put('/:id/completed', ensureAuthenticated, async (req, res) => {
  let game
  try {
    game = await Game.findById(req.params.id)
    game.team_a_goals = req.body.team_a_goals
    game.team_b_goals = req.body.team_b_goals
    game.yellow_cards = req.body.yellow_cards
    game.red_card = req.body.red_card
    if(req.body.red_card == null) {
      game.red_card = false
    }
    game.completed = true
    await game.save()
    res.redirect(`/games/${game.id}`)
  } catch(err) {
    if(game == null) {
      res.redirect('/games')
      console.log('Name null')
      console.log(err)
    } else {
        console.log('Error updating')
        console.log(err)
    }
  }
})

// Request to edit betting lines in mongodb
router.put('/:id', ensureAuthenticated, async (req, res) => {
  let game
  try {
    game = await Game.findById(req.params.id)
    game.team_a = req.body.team_a
    game.odds_a = req.body.odds_a
    game.team_b = req.body.team_b
    game.odds_b = req.body.odds_b   
    game.odds_draw = req.body.odds_draw
    game.ougoals = req.body.ougoals
    game.odds_ougoals = req.body.odds_ougoals
    game.started = req.body.started
    game.completed = req.body.completed
    if(req.body.started == null) {
      game.started = false
    }
    if(req.body.completed == null) {
      game.completed = false
    }
    await game.save()
    res.redirect(`/games/${game.id}`)
  } catch(err) {
    if(game == null) {
      res.redirect('/games')
      console.log('Name null')
      console.log(err)
    } else {
        console.log('Error updating')
        console.log(err)
        req.flash('error_msg', 'Cannot update, bets already placed')  
      res.redirect(`/games/${game.id}`)
    }
  }
})

router.delete('/:id', ensureAuthenticated, async (req, res) => {
  let game
  try {
    game = await Game.findById(req.params.id)
    await game.remove()
    res.redirect('/games')
  } catch (err){
    if(game == null) {
      res.redirect('/games')
      console.log('Name null')
    } else {
      console.log(err)
      req.flash('error_msg', 'Cannot delete, bets already placed')  
      res.redirect(`/games/${game.id}`)
      console.log('Error deleteing')       
    }
  }

})


module.exports = router
