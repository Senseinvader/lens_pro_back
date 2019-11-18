const {clearHash} = require('../services/cache');

module.exports = async (req, res, next) => {
  await next();
  clearHash('posts');
  clearHash(req.user.id.toString());
};