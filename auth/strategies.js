'use strict';
const { Strategy: LocalStrategy } = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../users/models');


const localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, callback) => {
  let user;
  User.findOne({ email })
    .then(_user => {
      user = _user;
      if (!user) { 
        // Return a rejected promise so we break out of the chain of .thens.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Could not find user with that email'
        }); 
      }
      return user.validatePassword(password);
    })
    // password invalid
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password'
        });
      }
        // password is valid, return user
      return callback(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return callback(null, false, err);
      }
      return callback(err, false);
    });
});


const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

module.exports = { localStrategy, jwtStrategy };
