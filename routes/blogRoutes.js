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

  app.get('/myblogs', requireLogin, async (req, res, next) => {
    try {
      console.log(req.user.id);
      const myPosts = await Post.find({author: req.user.id});
      if(!myPosts.length) {
        return res.status(200).json({message: 'You don\'t have posts yet'});
      }
      return res.status(200).json({
        message: 'Posts fetched successfully',
        posts: myPosts
      })
    } catch (err) {
      return res.json({message: `Error ${err}`});
    }
  });

  app.post('/blogs', requireLogin, async (req, res) => {
    try {
      const newPost = new Post({
        id: new mongoose.Types.ObjectId(),
        author: req.user.id,
        title: req.body.title,
        content: req.body.content
      });
      await newPost.save();
      const posts = await Post.find({});
      return res.status(201).json({
        message: 'Post has been successfully sent to the database',
        posts: posts
      });
    } catch (err) {
      res.json({message: `Error ${err}`});
    }
  });
};