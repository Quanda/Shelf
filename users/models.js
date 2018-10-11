'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const BookSchema = mongoose.Schema({
    title: String,
    author: String,
    isbn: {
      type: String,
      unique: false,
      sparse: true
    },
    description: String,
    book_added: Date,
    book_modified: Date,
    image_link: String,
    rating_user: Number,
    rating_avg: Number
});

const UserSchema = mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  books: [BookSchema]
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
