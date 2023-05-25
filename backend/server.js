import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import listEndpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-auth';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.json({
    responseMessage: 'Week 16 - Authentication',
    data: listEndpoints(app),
  });
});
////// USER /////////
// create user schema
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString('hex'),
  },
});

// create user model
const User = mongoose.model('User', UserSchema);

// create user endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body; // get username and password from request body
  try {
    const salt = bcrypt.genSaltSync(); // generate salt
    const newUser = await new User({
      // create new user
      username: username, // set username
      password: bcrypt.hashSync(password, salt), // set password
    }).save(); // save user to database
    res.status(201).json({
      // send response
      success: true, // set success to true
      response: {
        // send response object
        username: newUser.username, // send username
        id: newUser._id, // send id
        accessToken: newUser.accessToken, // send accessToken
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      // response: e
      message: 'Invalid request',
      errors: err.errors,
    });
  }
});
/////////////////// LOGIN ///////////////////////
app.post('/login', async (req, res) => {
  const { username, password } = req.body; // get username and password from request body
  try {
    const user = await User.findOne({ username }); // find user
    if (user && bcrypt.compareSync(password, user.password)) {
      // if user exists and password is correct
      res.status(200).json({
        // send response
        success: true, // set success to true
        response: {
          // send response object to frontend
          username: user.username, // send username
          id: user._id, // send id
          accessToken: user.accessToken, // send accessToken
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      // response: e
      message: 'Invalid request',
      errors: err.errors,
    });
  }
});
/// Secret message
const SecretSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  user: {
    type: String,
    required: true,
  },
});

// secret message model
const Secret = mongoose.model('Secret', SecretSchema);

// authenticate the user
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header('Authorization'); // get accessToken from request header
  try {
    // try to find user by accessToken
    const user = await User.findOne({ accessToken: accessToken }); // find user by accessToken
    if (user) {
      // if user exists
      next(); // call next() to continue to the next middleware
    } else {
      // if user does not exist
      res.status(401).json({
        // send response to frontend
        success: false,
        response: 'Not authorized',
      });
    }
  } catch (e) {
    // if something goes wrong with the database query we send an error response
    res.status(401).json({
      success: false,
      response: e,
    });
  }
};

// we want to make sure that only logged in users can access this endpoint
app.get('/secrets', authenticateUser);
app.get('/secrets', async (req, res) => {
  const secrets = await Secret.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec();
  res.json(secrets);
});

app.post('/secrets', authenticateUser);
app.post('/secrets', async (req, res) => {
  // create secret message
  const { message } = req.body; // get message from request body
  const accessToken = req.header('Authorization'); // get accessToken from request header
  const user = await User.findOne({ accessToken: accessToken }); // find user by accessToken
  const secrets = await new Secret({ message: message, user: user._id }).save(); // create new secret message and save to database
});

////////////

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
