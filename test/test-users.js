const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server.js');
const { User } = require('../users');
const { TEST_DATABASE_URL, PORT } = require('../config');

const expect = chai.expect;
const faker = require('faker');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);


  describe('/api/users', function() {
      
      const username = 'exampleUser';
      const password = 'examplePass';
      const firstName = 'Example';
      const lastName = 'User';
      const usernameB = 'exampleUserB';
      const passwordB = 'examplePassB';
      const firstNameB = 'ExampleB';
      const lastNameB = 'UserB';
      
      before(function() {
        return runServer(TEST_DATABASE_URL);
      });

      after(function() {
        return closeServer();
      });

      beforeEach(function() {});

      afterEach(function() {
        return User.remove({});
      });
     
      
  
    describe('POST', function() {
      it('Should reject users with missing username', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            password,
            firstName,
            lastName
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('username');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with missing password', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            firstName,
            lastName
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('password');
           })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with empty username', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username: '',
            password,
            firstName,
            lastName
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('username');
            expect(res.body.message).to.equal('Must be at least 2 characters long');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with password less than 6 characters', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password: '12345',
            firstName,
            lastName
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('password');
            expect(res.body.message).to.equal('Must be at least 6 characters long');
           })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with duplicate username', function() {
        // Create an initial user
        return User.create({
          username,
          password,
          firstName,
          lastName
        })
          .then(() =>
            // Try to create a second user with the same username
            chai.request(app).post('/api/users').send({
              username,
              password,
              firstName,
              lastName
            })
          )
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('username');
            expect(res.body.message).to.equal('Username already taken');
           })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should create a new user', function() {
        return chai
          .request(app)
          .post('/api/users')
          .send({
            username,
            password,
            firstName,
            lastName
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'firstName',
              'lastName'
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
      it('Should LOGIN then ADD, GET, UPDATE, DELETE book ', function() {
        let token, isbn;
        return User.hashPassword(password).then(password =>
          User.create({
            username,
            password
          })
        )
        .then(res => { // login
            return chai
            .request(app)
            .post('/api/auth/login')
            .send({ username, password})
            .then(res => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              token = res.body.token;
              expect(token).to.be.a('string');
              const payload = jwt.verify(token, process.env.JWT_SECRET, {
                algorithm: ['HS256']
              });
            })
            .then(res => { // add book
             return chai
              .request(app)
              .post('/api/users/books')
              .set('Authorization', 'Bearer ' + token)
              .send({
                title: faker.lorem.sentence(),
                author: faker.lorem.text(),
                isbn: faker.random.alphaNumeric(),
                description: faker.lorem.sentences(),
                book_added: Date.now(),
                rating_avg: 3,
                imageLink: './defaultBook.png'
              })
              .then(res => {
                isbn = res.body.isbn;
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object')
                return res.body;
              })
              .catch(err => {
                 console.log(err);
                 return err;
             })
            });
        })
        .then(() => { // get book
         return chai
          .request(app)
          .get(`/api/users/books/${isbn}`)
          .set('Authorization', 'Bearer ' + token)
          .then(res => {
            expect(res).to.have.status(200);
            return res.body;
          })
          .catch(err => {
             console.log(err);
             return err;
         })
        })
        .then(() => { // update book
         return chai
          .request(app)
          .put(`/api/users/books/${isbn}/5`)
          .set('Authorization', 'Bearer ' + token)
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body.nModified).to.equal(1);
            return res.body;
          })
          .catch(err => {
             console.log(err);
             return err;
         })
        }) 
        .then(() => { // delete book
         return chai
          .request(app)
          .delete(`/api/users/books/${isbn}`)
          .set('Authorization', 'Bearer ' + token)
          .then(res => {
            expect(res).to.have.status(204);
            return res.body;
          })
          .catch(err => {
             console.log(err);
             return err;
         })
        }) 
      });
    });
     
    describe('GET', function() {
      it('Should return an empty array initially', function() {
        return chai.request(app).get('/api/users').then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(0);
        });
      });
      it('Should return an array of users', function() {
        return User.create(
          {
            username,
            password,
            firstName,
            lastName
          },
          {
            username: usernameB,
            password: passwordB,
            firstName: firstNameB,
            lastName: lastNameB
          }
        )
          .then(() => chai.request(app).get('/api/users'))
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.length(2);
            expect(res.body[0]).to.deep.equal({
              username,
              firstName,
              lastName
            });
            expect(res.body[1]).to.deep.equal({
              username: usernameB,
              firstName: firstNameB,
              lastName: lastNameB
            });
          });
      });
    });
  });
