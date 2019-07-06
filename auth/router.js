'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();


const createAuthToken = function(user) {
  return jwt.sign({user}, process.env.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

// The user provides a username and password to login
// Runs through localAuth middleware to handle authentication
// If auth successful, creates and responds with a JWT 
router.post('/login', localAuth, (req, res) => {
  console.log('authenticated user');
  const authToken = createAuthToken(req.user.serialize());
   
  res.json({token: authToken});
})


const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  console.log('authenticated user');
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

module.exports = {router};
