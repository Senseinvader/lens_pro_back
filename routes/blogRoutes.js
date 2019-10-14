const Post = require('../models/Post');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');


module.exports = (app) => {
  app.get('/blogs', requireLogin, async (req, res) => {
    try {
      console.log('request ', req.user)
      const posts = await Post.find({});
      if(!posts.length) {
        return res.status(200).json({message: 'No posts are currently in the database'});
      }
      return res.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
      });
    } catch (err) {
      return res.json({message: `Error: ${err}`});  
    }
  });

  app.post('/blogs', async (req, res) => {
    try {
      const newPost = new Post({
        id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content
      });
      await newPost.save();
      return res.status(201).json({
        message: 'Post has been successfully sent to the database',
        post: newPost
      });
    } catch (err) {
      res.json({message: `Error ${err}`});
    }
  })
};