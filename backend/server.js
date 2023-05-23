import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import listEndpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';
// import crypto from 'crypto';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
