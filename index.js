const express = require('express');
const mongoose = require('mongoose');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const keys = require('./keys/dev');

require('./models/User');
require('./models/Post');
require('./services/passport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoUrl, {useNewUrlParser: true}).catch(err => console.log('Unable to connect to the database', err));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors({credentials: true, origin: true}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', "http://localhost:8081");
  res.header('Access-Control-Allow-Header', 'Origin, Authorization, Content-Type, Accept');
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.status(200).json({});
  }
  next();
});

app.use(session({
  maxAge: 30 * 24 * 60 * 1000,
  keys: [keys.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hit the root route');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});