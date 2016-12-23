module.exports = {

  isLoggedIn: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  },

  notLoggedIn: function(req, res, next) {
    if(!req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }

}
