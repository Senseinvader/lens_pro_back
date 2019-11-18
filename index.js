require("appdynamics").profile({
  controllerHostName: 'localhost',
  controllerPort: 8090,
    accountName: 'customer1',
  accountAccessKey: 'eb9f94a4-badd-465d-920e-684b69abced2',
  applicationName: 'lens_pro_app',
  tierName: 'lens_pro_tier',
  libagent: true,
  nodeName: 'process', // The controller will automatically append the node name with a unique number
  alwaysAddEumMetadataInHttpHeaders: true,
  debug:true
 });

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
var corsOptions = {
  credentials: true, 
  origin: true,
  exposedHeaders: ['ADRUM_0','ADRUM_1','ADRUM_2','ADRUM_3','ADRUM_4']
};
app.use(cors(corsOptions))
// app.use(cors({credentials: true, origin: true, exposedHeaders: ['allow-control-expose-headers', 'access-control-allow-headers', 'ADRUM_0','ADRUM_1','ADRUM_2','ADRUM_3','ADRUM_4','ADRUM_5','ADRUM_6','ADRUM_7','ADRUM_8','ADRUM_9']}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', "http://localhost:8081");
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Allow-Control-Expose-Headers', 'ADRUM_0,ADRUM_1,ADRUM_2,ADRUM_3,ADRUM_4,ADRUM_5,ADRUM_6,ADRUM_7,ADRUM_8,ADRUM_9,ADRUM_10,ADRUM_11,ADRUM_12,ADRUM_13,ADRUM_14,ADRUM_15,ADRUM_16,ADRUM_17,ADRUM_18');
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.status(200).json({});
  }
  next();
});

app.use(session({
  // maxAge: 30 * 24 * 60 * 1000,
  keys: [keys.cookieKey],
  // httpOnly: false
}));

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

const port = process.env.PORT || 3005;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});