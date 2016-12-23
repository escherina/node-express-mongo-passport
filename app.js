const express = require('express')
const path = require('path')
const expressHbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const validator = require('express-validator')
const MongoStore = require('connect-mongo')(session)


// Routes
const indexRoute = require('./routes/index')
const userRoute = require('./routes/user')
const addRoute = require('./routes/add')

// Create the express app
const app = express()

// If undefined in our process, load our local env file which should contain
// these two lines:
// process.env['MONGODB_USER'] = ""
// process.env['MONGODB_PW'] = ""
// These will be executed and set when you require env.js
// Make sure to add it to .gitignore!
// source: http://thewebivore.com/super-simple-environment-variables-node-js/
if(!process.env.MONGODB_USER) {
  const env = require('./env.js')
}

// Connect to Mongo database
mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@ds021691.mlab.com:21691/mydollwardrobe`)

// Set up Passport
require('./lib/passport')

// View engine
// if you miss off the extname config, you'll need to use .handlebars files
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', '.hbs')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(validator())
app.use(session({
  secret: 'my super secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 } // 3 hours
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

// Make session available in all views
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next()
})

// Routes
app.use('/add', addRoute)
app.use('/user', userRoute)
app.use('/', indexRoute)


app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
