const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({id: id}).then(user => {
    done(null, user);
  })
});

passport.use(new LocalStrategy({usernameField: 'email'},
  function(username, password, done) {
    User.findOne({email: username}, function(err, user) {
      if(err) {return done(err);}
      if(!user) {return done(null, false);}
      if(!bcrypt.compare(password, user.password)) {return done(null, false);}
      return done(null, user);
    });
  }
));