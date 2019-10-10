const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = (app) => {
  
  app.post('/signup', async (req, res, next) => {
    try {
      const user = await User.findOne({
        email: req.body.email
      });
      console.log('user', user)
      if(user) {
        return res.status(409).json({
          message: "The user with this email already exists"
        });
      } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10).catch(err => res.status(500).json('error', err));
        const newUser = new User({
          id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hashedPassword
        });
        await newUser.save();
        return res.status(201).json({
          message: 'User was successfully signed up',
          user: user
        })
      }
    } catch(error) {
      return res.json({message: `smth went wrong ${error}`});
    }
  });

  app.post('/login', async(req, res, next) => {
    try {
      console.log(req.body.email)
      const user = await User.findOne({
        email: req.body.email,
      });
      if(!user) {
        return res.status(401).json({message: 'Auth failed, user wasn\'t found'})
      }
      const passCheck = bcrypt.compare(req.body.password, user.password).catch(err => res.status(401).json({message: 'Auth failed, user password doesn\'t match'}));
      if(passCheck) {
        return res.status(200).json({
          user: user,
          message: 'Auth successful'
        });
      }
    } catch (error) {
      return res.json({message: `smth went wrong ${error}`})
    }
  })
};