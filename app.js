// App.js
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const authRoutes = require('./routes/auth');
const sequelize = require('./models/index');
const path = require('path');
const app = express();

// Set up session middleware
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Configure Passport to use Google OAuth 2.0
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
  console.log('profile=', profile);
  return done(null, profile);
}));

// Serialize user into the session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Route to start the OAuth flow
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] })
);

// Callback route once Google has authenticated the user
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.use('/auth', authRoutes);
app.use(express.static(path.join(__dirname, 'views')));

app.get('/home', (req, res) => {
  console.log(res);
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
  } else {
    res.sendFile((path.join(__dirname,'views', '/signup.html')));
  }
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Postgres connected'))
  .catch(err => console.log('Database connection error:', err));

// Sync models with the database
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.log('Error syncing database:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
