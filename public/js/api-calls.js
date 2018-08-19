// calls API to GET ALL Users books
// todo - add filtering capabilities
function getUserBooks(callback) {
    $.ajax({
       url: '/api/users/books',
       type: 'GET',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')},
       dataType: 'JSON'
    })
    .done(function( data ) { // arr of user books
        callback(data);
    })
    .fail(function (err) {
        console.error(err);
    });
}

// calls API to GET a User book
function findBook(isbn, callback) {
    $.ajax({
       url: `/api/users/books/${isbn}`,
       type: 'GET',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')},
    })
    .done(function( data ) {    
        callback(data);
    })
    .fail(function (err) {
        console.error(err);
    })
}
// calls API to ADD a User book
function addBook(book) {
    $.ajax({
       url: '/api/users/books',
       type: 'POST',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')},
       data: JSON.stringify(book),
       contentType: 'application/json',
       dataType: 'JSON'
    })
    .done(function( data ) {
        $('.book-result-dialog').append(`<h3 id="successInfo" style="color: #5cb85c">Added ${book.title} to your Shelf!</h3>`);
    })
    .fail(function (err) {
        console.log(err);
        $('.book-result-dialog').append(`<h3 id="warningInfo" style="color: #d43f3a">${err.statusText}</h3>`);
    })
}
// calls API to UPDATE a User book rating
function updateRating(isbn, new_rating) {
    $('#successInfo').remove();
   $.ajax({
       url: `/api/users/books/${isbn}/${new_rating}`,
       type: 'PUT',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')}
    })
    .done(function( data ) {
       console.log(data)
        $('.book-result-dialog').append(`<h3 id="successInfo" style="color: #5cb85c">Rating updated!</h3>`);
    })
    .fail(function (err) {
        console.log(err);
        $('.book-result-dialog').append(`<h3 id="warningInfo" style="color: #d43f3a">${err.statusText}</h3>`);
    }) 
}

// calls API to DELETE User book
function deleteBook(isbn) {
    $.ajax({
       url: `/api/users/books/${isbn}`,
       type: 'DELETE',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')}
    })
    .done(function( data ) {
        // remove book from sessionStorage
        sessionStorage.removeItem(isbn);

        // render homepage        
        window.location.replace("/home.html")
    })
    .fail(function (err) {
        console.log(err);
    })
}

// calls API to get an updated Auth token (JWT)
function getAuthToken(callback) {
    $.ajax({
       url: '/api/auth/refresh',
       type: 'POST',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')}
    })
    .done(function( data ) {
        callback(data.authToken);
    })
    .fail(function (err) {
        console.log(err);
    })
}

// calls login API route to authenticate
function authenticateUser() {
    $.ajax({
       url: '/api/auth/login',
       type: 'POST',
       data: {username: $('#username').val(), password: $('#password').val()},
       dataType: 'JSON'
    })
    .done(function( data ) {
        sessionStorage.setItem('token', data.token);
        $('.auth-warning').removeClass('warning-on').text('');
        $('.login-btn').addClass('hidden');

        getUserBooks(updateSessionStorageWithBooks);
        
        window.location.replace("/home.html");
    })
    .fail(function (err) {
        console.log(err);
        $('.auth-warning').addClass('warning-on').text(`${err.responseText}`);
    })
}

// calls registration API route to register new User
function registerUser(user) {
    $.ajax({
       url: '/api/users',
       type: 'POST',
       data: JSON.stringify(user),
       contentType: 'application/json',
       dataType: 'JSON'
    })
    .done(function( data ) {
        $('.auth-warning').removeClass('warning-on').text('');

        getUserBooks(updateSessionStorageWithBooks);
        
        window.location.replace("/home.html");
    })
    .fail(function (err) {
        console.log(err);
        $('.auth-warning').addClass('warning-on').text(`${err.responseJSON.location}: ${err.responseJSON.message}`);
    })
}

function updateSessionStorageWithBooks(data) {
    data.books.forEach( (book, index) => {
        sessionStorage.setItem(data.books[index].isbn, JSON.stringify(data.books[index]));
    })
}