const express = require('express')
const router = express.Router()
const csrf = require('csurf')
const passport = require('passport')

const helpers = require('../lib/helpers')

const csrfProtection = csrf()
router.use(csrfProtection)

router.get('/profile', helpers.isLoggedIn, (req, res) => {
  res.render('user/profile', {user: req.user})
})

router.get('/logout', helpers.isLoggedIn, (req, res, next) => {
  req.logout()
  res.redirect('/')
})

// All the routes below this one will redirect to '/' if the user is logged in
router.use('/', helpers.notLoggedIn, (req, res, next) => {
  next()
})

router.get('/signup', (req, res, next) => {
  let messages = req.flash('error')
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
})

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}), (req, res, next) => res.redirect('/user/profile'))

router.get('/login', (req, res, next) => {
  let messages = req.flash('error')
  res.render('user/login', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
})

router.post('/login', passport.authenticate('local.signin', {
  failureRedirect: '/user/login',
  failureFlash: true
}), (req, res, next) => res.redirect('/user/profile'))

module.exports = router
