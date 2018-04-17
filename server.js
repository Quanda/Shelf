// load express
const express = require('express');
const mongoose = require('mongoose');

// reveal config vars
const { PORT, DATABASE_URL } = require('./config');

// create app
const app = express();


// serve static assets from public folder
app.use(express.static('public/views'));
app.use(express.static('public/js'));
app.use(express.static('public/styles'));


// both runServer and closeServer need to access the same
// server object, so we declare `server` here, and then when
// runServer runs, it assigns a value.
let server;

// this function starts our server and returns a Promise.
function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
        if(err) {
            return reject(err);
        }
    })
    server = app.listen(PORT, () => {
      console.log(`Your app is listening on port ${PORT}`);
      resolve();
    }).on('error', err => {
      mongoose.disconnect();
      reject(err);
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          reject(err);
        }
      resolve();
      });
    });   
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};


module.exports = {app, runServer, closeServer};
