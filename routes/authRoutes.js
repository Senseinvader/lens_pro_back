const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');

module.exports = (app) => {
  
  app.post('/signup', async (req, res, next) => {
    try {
      const user = await User.findOne({
        email: req.body.email
      });
      if(user) {
        return res.status(409).json({
          message: "The user with this email already exists"
        });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10).catch(err => res.status(500).json({error: err}));
        const user = new User({
          id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
        });
        await user.save();
        req.login(user, (err) => {
          if(err) console.log(err);
          return res.status(201).json({
            message: 'User was successfully signed up',
            user: user
          });
        })
      }
    } catch(error) {
      return res.json({message: `smth went wrong ${error}`});
    }
  });

  app.post('/login', passport.authenticate('local', { failureMessage: "Invalid username or password" }), (req, res, next) => {
    try {
      res.status(200).json({
        message: 'Auth successful',
        user: req.user
      });
    } catch (error) {
      return res.status(401).json({message: `smth went wrong ${error}`})
    }
  });

  app.get('/logout', (req, res) => {
    req.logout();
    return res.status(200).json({message: 'User logged out'});
  })
};