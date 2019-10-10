const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  email: String,
  password: String
});

module.exports = mongoose.model('User', userSchema);