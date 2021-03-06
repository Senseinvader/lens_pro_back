const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String
});

module.exports = mongoose.model('Post', postSchema);