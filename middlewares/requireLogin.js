
module.exports = (req, res, next) => {
  if(!req.user) {
    return res.status(401).json({message: 'You have to be authorized to see contents'})
  }
  
  next();
}