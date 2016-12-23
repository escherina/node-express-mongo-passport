const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail()
  req.checkBody('password', 'Password must be at least 6 characters long.').notEmpty().isLength({min: 6})
  req.checkBody('username', 'You must enter a username.').notEmpty()
  // Handle errors:
  let errors = req.validationErrors()
  if(errors) {
    var messages = [];
    errors.forEach(error => {
      messages.push(error.msg)
    })
    return done(null, false, req.flash('error', messages))
  }
  // Check if there is already a user with that email OR user

  User.findOne(
    {$or:
      [
        // search the username field
        {username: req.body.username.toLowerCase()},
        {email: req.body.email.toLowerCase()}
      ]
    }, (err, user) => {
    if(err) {
      return done(err)
    }
    // If a user is found
    if(user) {
      // N.B: User.find returns is an array so we must select the first item
      console.log(user, req.body)
      if (user.username === req.body.username.toLowerCase()) {
        return done(null, false, {message: 'Username is already in use.'})
      } else if (user.email === req.body.email.toLowerCase()) {
        return done(null, false, {message: 'Email is already in use.'})
      }
    }

    // No errors -> create a new user and save to database
    let newUser = new User()
    newUser.email = email
    newUser.password = newUser.encryptPassword(password)
    newUser.username = req.body.username
    newUser.username_lower = req.body.username.toLowerCase()
    newUser.save((err, result) => {
      if(err) {
        return done(err);
      }
      return done(null, newUser);
    })
  })
}))


passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password.').notEmpty();
  // Handle errors:
  let errors = req.validationErrors();
  if(errors) {
    var messages = [];
    errors.forEach(error => {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages))
  }
  // No errors -> proceed to find user by email
  User.findOne({'email': email}, (err, user) => {
    if(err) {
      return done(err);
    }
    // No user found for that email
    if(!user) {
      return done(null, false, {message: 'User not found.'});
    }
    // Password not valid
    if(!user.validPassword(password)) {
      return done(null, false, {message: 'Wrong password.'});
    }
    return done(null, user);
  });
}));
