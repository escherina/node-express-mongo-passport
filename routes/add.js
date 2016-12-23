const express = require('express')
const router = express.Router()

const helpers = require('../lib/helpers')

router.get('/doll', helpers.isLoggedIn, (req, res) => {
  res.render('add-doll')
})

router.get('/wardrobe', helpers.isLoggedIn, (req, res) => {
  res.render('add-wardrobe')
})

module.exports = router
