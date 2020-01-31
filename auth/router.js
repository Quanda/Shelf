'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../users/models');
const crypto = require('crypto');
const config = require('../config');
const router = express.Router();
const bcrypt = require('bcryptjs');

const createAuthToken = function(user) {
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    subject: user.email,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', { session: false });

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// The user provides a username and password to login
// Runs through localAuth middleware to handle authentication
// If auth successful, creates and responds with a JWT 
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({ token: authToken });
})


const jwtAuth = passport.authenticate('jwt', { session: false });

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

const BCRYPT_SALT_ROUNDS = 12;
router.put('/updatePasswordViaToken', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    resetPasswordToken: req.body.resetPasswordToken,
    resetPasswordExpires: { $gte: new Date() }
  });

  if (user == null) {
    res.status(403).send('This link is invalid or has expired');
  } else if (user != null) {
    const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS);
    user.password = hashedPassword;
    user.resetPasswordExpires = null;
    user.resetPasswordToken = null;
    await user.save();
    res.status(200).send({ message: 'password updated' });
  } else {
    res.status(401).json('no user found');
  }
});

router.get('/verifyPasswordResetToken', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.query.resetPasswordToken,
    resetPasswordExpires: { $gte: new Date() }, 
  });

  if (user == null) {
    res.status(403).send('This link is invalid or has expired');
  } else {
    res.status(200).send({ email: user.email, message: 'valid reset token' });
  }
});

router.post('/forgotPassword', async (req, res) => {
  if (req.body.email === '') {
    res.status(400).send('Email required');
  }

  let user = await User.findOne({ email: req.body.email });

  if (user === null) {
    res.status(403).send('Email does not exist');
  } else {
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);
    await user.save();
    
    // send password reset link email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: { user: process.env.EMAIL_SENDER_ADDRESS, pass: process.env.EMAIL_SENDER_PASSWORD },
    });

    const mailOptions = {
      from: { name: 'Shelf App', address: process.env.EMAIL_SENDER_ADDRESS },
      to: user.email,
      subject: 'Reset your Shelf Password',
      html:
        `<div><p>Hey! Someone has requested to change your Shelf account's password.</p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p>If it was you, set a new password by clicking the following link or pasting it into your browser:</p>
          <a href="${process.env.CLIENT_DOMAIN}/resetpassword/${token}">Reset my Password</a>
          <p>Or paste this link into your browser: ${process.env.CLIENT_DOMAIN}/resetpassword/${token}</p></div>`
    };
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('Something went wrong:', err);
      } else {
        res.status(200).json('Email sent! Check your inbox for a reset link');
      }
    });
  }
})

module.exports = { router };
