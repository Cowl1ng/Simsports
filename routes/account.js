const express = require('express')
const router = express.Router()
const Bet = require('../models/bet')
const User = require('../models/User')
const { ensureAuthenticated } = require('../config/auth')

// All bets route
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.findById(req.user.id)
    // res.render('/', {user: user })
    res.render('./account', {
      name: users.name,
      balance: users.balance,
    })
  } catch {
    res.redirect('/games')
  }
  
  
  
})

// // Show create game  page route
// router.get('/new', ensureAuthenticated, (req, res) => {
//   res.render('games/new', {game: new Game() })
// })

// //Create game route
// router.post('/', ensureAuthenticated, async (req, res) =>{
//   console.log('Submitting new game')
//   const newGame = new Game ({
//     team_a: req.body.team_a,
//     odds_a: req.body.odds_a,
//     team_b: req.body.team_b,
//     odds_b: req.body.odds_b,   
//     odds_draw: req.body.odds_draw,
//     ougoals: req.body.ougoals,
//     odds_ogoals: req.body.odds_ogoals,
//     odds_ugoals: req.body.odds_ugoals
//   })
//   newGame.save()
//             .then(game => {
//               req.flash('success_msg', 'Game created')
//               res.redirect('/games')
//             })
//             .catch(err => console.log(err))
// })

// // Betting page test
// router.get('/odds', ensureAuthenticated, async (req, res) => {
//   try {
//     const games = await Game.find({})
//     res.render ('games/odds', {games: games}) 
//   } catch {
//       res.redirect('/games')
//       console.log('Failed')
//   }
// })

// // Indivdual game route
// router.get('/:id', async (req, res) => {
//   try {
//     const game = await Game.findById(req.params.id)
//     res.render('games/show', {game: game })
//   } catch {
//     res.redirect('/games')
//   }
// })

// router.get('/:id/edit', async (req, res) => {
//   try {
//     const game = await Game.findById(req.params.id)
//     res.render('games/edit', {game: game })
//   } catch {
//     res.redirect('/games')
//   }
  
// })

// router.put('/:id', async (req, res) => {
//   let game
//   try {
//     game = await Game.findById(req.params.id)
//     game.team_a = req.body.team_a
//     game.odds_a = req.body.odds_a
//     game.team_b = req.body.team_b
//     game.odds_b = req.body.odds_b   
//     game.odds_draw = req.body.odds_draw
//     game.ougoals = req.body.ougoals
//     game.odds_ougoals = req.body.odds_ougoals
//     game.number = req.body.game_number
//     await game.save()
//     res.redirect(`/games/${game.id}`)
//   } catch(err) {
//     if(game == null) {
//       res.redirect('/games')
//       console.log('Name null')
//       console.log(err)
//     } else {
//         console.log('Error updating')
//         console.log(err)
//     }
//   }
// })

// router.delete('/:id', async (req, res) => {
//   let game
//   try {
//     game = await Game.findById(req.params.id)
//     await game.remove()
//     res.redirect('/games')
//   } catch {
//     if(game == null) {
//       res.redirect('/games')
//       console.log('Name null')
//     } else {
//         res.redirect(`/games/${game.id}`)
//         console.log('Error deleteing')       
//     }
//   }

// })

module.exports = router
