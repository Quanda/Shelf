'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const BookSchema = mongoose.Schema({
    title: String,
    author: String,
    isbn: String,
    description: String,
    book_added: Date,
    book_modified: Date,
    image_link: String,
    shelf_type: String,
    book_status: { type: String, required: true, default: 'Active', enum: ['Active', 'Finished', 'Next Up']},
});

const UserSchema = mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: false },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  books: [BookSchema]
});

UserSchema.methods.serialize = function() {
  return {
    email: this.email || '',
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
