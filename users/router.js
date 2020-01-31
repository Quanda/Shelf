'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const { User } = require('./models');

const router = express.Router();
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });

// Get all books
// A protected endpoint which needs a valid JWT to access it
router.get('/books', jwtAuth, (req, res) => {
    const { email } = req.user;
    // return users books
    return User.findOne({ email }, 'books', function(err, books) {
        if (err) console.error(err);
        return res.json(books);
    })
});

// Get a single book
// A protected endpoint which needs a valid JWT to access it
router.get('/books/:isbn', jwtAuth, (req, res) => {
    const isbn = req.params.isbn;
    const { email } = req.user;
    
    // return single user book
    return User.findOne({ email },  {"books": { $elemMatch: { isbn }}})
      .then( data => res.json(data.books[0]))
});

// Add book to user shelf
// A protected endpoint which needs a valid JWT to access it
router.post('/books', jwtAuth, jsonParser, (req, res) => {
    const { email } = req.user;
    const newBook = req.body;
    const { isbn } = newBook;

    return User.findOne({ email },  {"books": { $elemMatch: { isbn }}})
      .then(data => {
        const { length } = data.books;
        // if book does not yet exist, add it
        if (length === 0) {
        return User.updateOne( { email }, { $push: {"books": newBook }})
          .then( function() {
            return res.json(newBook);
          })
          .catch( err => {
            return res.status(500).json({ message: `Internal server error` })
          });
        } else {
          return res.status(409).json({ message: 'Book already exists' })
        }
      })
});

// Delete a single book
// A protected endpoint which needs a valid JWT to access it
router.delete('/books/:isbn', jwtAuth, (req, res) => {
    const isbn = req.params.isbn;
    const { email } = req.user;
    
    // delete book from db
    return User.updateOne({ email }, { $pull: { 'books': { isbn: isbn } }})
     .then( function(data) {
        if(data.nModified > 0) {
           return res.sendStatus(204);
        }
        else {
            return res.sendStatus(404);
        }
     })
     .catch( err => {
       return res.status(500).json({ message: `Internal server error` });
     });

});

// Update Book status (Active, Complete, Next)
// A protected endpoint which needs a valid JWT to access it
router.put('/books/:isbn/:status', jwtAuth, jsonParser, (req, res) => {
    const { email } = req.user;
    const isbn = req.params.isbn;
    const { status } = req.params;
    
    let user_id;
    User.find( { email } )
    .then( data => {
      user_id = data[0]._id
        
      let query = { _id: user_id, books: { $elemMatch: { isbn } } };
      let update = { "books.$.book_status": status}

      return User.updateOne(query, { $set: update }, { runValidators: true })
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err.message }));
    })
});

// Post to register a new user
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['email', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['email', 'username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    password: {
      min: 6,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { email, username, password, firstName = '', lastName = '' } = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  email = email.trim();
  username = username.trim();
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({ email })
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same email
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Email already taken',
          location: 'email'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        email,
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      console.log(err);
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});

module.exports = {router};
