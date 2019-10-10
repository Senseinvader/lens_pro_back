const express = require('express');
const mongoose = require('mongoose');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const keys = require('./keys/dev');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

require('./models/User');


const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoUrl, {useNewUrlParser: true}).catch(err => console.log('Unable to connect to the database', err));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

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