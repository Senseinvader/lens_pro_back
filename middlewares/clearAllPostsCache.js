const {clearHash} = require('../services/cache');

module.exports = async (err, res, next) => {
  await next();
  clearHash('posts');
};