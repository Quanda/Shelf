$(function() { // on ready    
    
getUserBooks(updateSessionStorageWithBooks);
    
getBooksFromSessionStorage(renderBooks)


// EVENT LISTENERS

//handle add book button click on homepage
// display the add book interface
$('#add-book-btn').on('click', function() {
    $('.add-book-background').removeClass('hidden');
    $('.add-book-dialog').removeClass('hidden');
});
// handle escaping from add book dialog
// hide modal
$('.add-book-dialog').on('click', '.close-btn', function() {
    $('.add-book-background').addClass('hidden');
    $('.add-book-dialog').addClass('hidden');
    $('.book-result-dialog').html('').addClass('hidden');
});
$('.book-result-dialog').on('click', '.close-btn', function() {
    console.log('closing book result');
    $('.book-result-dialog').addClass('hidden');
    $('.selected-volume img').remove();
});
// user submits search for book
// get book results from google api and call renderVolumes fn
$('.add-book-form').on('submit', function(event) {
    event.preventDefault();
    const SEARCH_STRING = $('#book-search').val();
    $('.volume-searchresults').children().remove();
    searchAllVolumes(SEARCH_STRING, renderVolumes)
});
$('.volume-searchresults').on('click', '.result', function() {
    let selectedBookId = $(this).attr('id');
    console.log(`clicked book ${selectedBookId}`);
    $('.book-result-dialog').removeClass('hidden');
    searchSingleVolume(selectedBookId, renderVolume);
    $('html, body').animate({ scrollTop: 0 }, 'fast');
});
// Add book to shelf
// gets bookId, looks up book, calls addToShelf fn
$('.book-result-dialog').on('click', '.add-to-shelf-btn', function() {
    let selectedBookId = $(this).parent().attr('id');
    
    searchSingleVolume(selectedBookId, addToShelf);
});
$('.book-result-dialog').on('click', '.view-books-btn', function() {
    getUserBooks(updateSessionStorageWithBooks);
    window.location.replace("/home.html")
});
    
$('.book-result-dialog').on('click', '.book-result-close', function() {
    $('.book-result-dialog').html('');
    $('.book-result-dialog').addClass('hidden');
});
// render user book
$('.user-books').on('click', '.result', function() {
    const isbn = $(this).attr('id');
    console.log(isbn);
    
    findBook(isbn, renderBook);
    
    $('.book-result-dialog').removeClass('hidden');
    $('html, body').animate({ scrollTop: 0 }, 'fast');
})

// Log user out
// Clear session storage and redirect to index
$('#logout-btn').on('click', function() {
    console.log('clicked logout btn');
    
    sessionStorage.clear();
    
    window.location.replace("/index.html")
})
 
// Refresh auth token
$('#refresh-token-btn').on('click', function() {
    console.log('clicked refresh token btn');
    
    getAuthToken(addAuthToken);
})


// RENDERING FUNCTIONS

// renders all volumes returned from google query
let renderVolumes = function(volumeResults) {   
    console.log(volumeResults);
    volumeResults.forEach( (volume) => {

        let author = volume.volumeInfo.authors[0];
        let description = volume.volumeInfo.description;
        let imageLink;
        if(typeof volume.volumeInfo.imageLinks != 'undefined') {
            if(typeof volume.volumeInfo.imageLinks.smallThumbnail != 'undefined') {
                imageLink = volume.volumeInfo.imageLinks.smallThumbnail;
            } else if (typeof volume.volumeInfo.imageLinks.thumbnail != 'undefined') {
                imageLink = volume.volumeInfo.imageLinks.thumbnail;
            }
        } else {
            imageLink = "./defaultBook.png" // SET TO DEFAULT IMAGE 
        }
    
        let volumeHtml = `
            <div class="result" id="${volume.id}">
                <img src="${imageLink}" alt="book image"/>
                <p> ${volume.volumeInfo.title}</p>
                <h5>by ${author}</h5>
            </div>`
        $('.volume-searchresults').append(volumeHtml);
    })
}
// render the view for a single volume
function renderVolume(volume) {
    console.log(volume);
    let author = volume.volumeInfo.authors[0];
    let description = volume.volumeInfo.description;
    let imageLink;
    if(typeof volume.volumeInfo.imageLinks != 'undefined') {
        if(typeof volume.volumeInfo.imageLinks.smallThumbnail != 'undefined') {
            imageLink = volume.volumeInfo.imageLinks.smallThumbnail;
        } else if (typeof volume.volumeInfo.imageLinks.thumbnail != 'undefined') {
            imageLink = volume.volumeInfo.imageLinks.thumbnail;
        }
    } else {
        imageLink = "./defaultBook.png" // SET TO DEFAULT IMAGE 
    }
    let volumeHtml = `
    <div class="selected-volume" id="${volume.id}">
        <a class="close-btn"></a>
        <img src="${imageLink}" alt="volume image"/>
        <p> ${volume.volumeInfo.title}</p>
        <h5>by ${author}</h5>
        <p>${description}</p>
        <button class="add-to-shelf-btn btn btn-primary btn-md">Add to Shelf</button>
        <button class="view-books-btn btn btn-primary btn-md">View books</button>
    </div>`
    $('.book-result-dialog').html(volumeHtml);
}


function getBooksFromSessionStorage(callback) {
    let USER_BOOKS = [];
    for(let i = 0; i < sessionStorage.length; i++){
        if(sessionStorage.key(i) != 'token') {
            let key = sessionStorage.key(i);
            console.log(`key: ${key}`);
            let bookObj = sessionStorage.getItem(key);
            USER_BOOKS.push(JSON.parse(bookObj));
        }
    }
    callback(USER_BOOKS);
}
    
// render the users books in the view
function renderBooks(books) {
    console.log('running renderBooks()')
    books.forEach( (book) => {
        let userBook = 
        `<div class="result" id="${book.isbn}">
            <img src="${book.image_link}" alt="book image"/>
            <h5> ${book.title}</h5>
            <p>${book.author}</p>
        </div>`
        
        $('.user-books').append(userBook);
    })
}

function renderBook(book) {
    console.log(book);
    let bookHtml = `
    <div class="user-book" id="${book.isbn}">
        <a class="close-btn"></a>
        <img src="${book.image_link}" alt="volume image"/>
        <h2> ${book.title}</p>
        <h5>${book.author}</h5>
        <p>${book.description}</p>
        <p>ISBN: ${book.isbn}</p>
        <p>Added: ${book.book_added}</p>
        <p>Last modified ${book.book_modified}</p>
        <p>Average Rating (out of 5): ${book.rating_avg}</p>
        <input type="button" id="delete-book-btn" name="delete-book-btn" value="Delete book" class="btn btn-danger btn-md">  
    </div>`
    $('.book-result-dialog').html('');
    $('.book-result-dialog').html(bookHtml);
}

// builds book object, calls api to create new book
function addToShelf(book) {
    $('#successInfo').remove();
    $('#warningInfo').remove();
    
    let isbn_index = 0;
    if(book.volumeInfo.industryIdentifiers.length > 1) {
        isbn_index = 1;
    }
    let imageLink;
    if(typeof book.volumeInfo.imageLinks != 'undefined') {
        if(typeof book.volumeInfo.imageLinks.smallThumbnail != 'undefined') {
            imageLink = book.volumeInfo.imageLinks.smallThumbnail;
        } else if (typeof book.volumeInfo.imageLinks.thumbnail != 'undefined') {
            imageLink = book.volumeInfo.imageLinks.thumbnail;
        }
    } else {
        imageLink = "./defaultBook.png" // SET TO DEFAULT IMAGE 
    }
    let bookObj = {
        "title": book.volumeInfo.title,
        "author": book.volumeInfo.authors[0],
        "isbn": book.volumeInfo.industryIdentifiers[isbn_index].identifier,
        "description": book.volumeInfo.description,
        "book_added": Date.now(),
        "book_modified": Date.now(),
        "rating_avg": book.volumeInfo.averageRating || 0,
        "rating_user": 0,
        "image_link": imageLink
    }
    
    // check if book exists in sessionStorage
    let bookExists = sessionStorage.getItem(bookObj.isbn);
    console.log(bookObj.isbn);
    console.log(bookExists);
    
    if(bookExists) {
        console.log('book already exists!');
        $('.book-result-dialog').append(`<h3 id="warningInfo" style="color: #d43f3a">Book already exists on Shelf</h3>`);
    } else {
        console.log('Adding new book!');
        addBook(bookObj);
    }
    
    getUserBooks(updateSessionStorageWithBooks);
    getBooksFromSessionStorage(renderBooks)
}

// find a book
function findBook(isbn, callback) {
    $.ajax({
       url: `/api/users/books/${isbn}`,
       type: 'GET',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')},
    })
    .done(function( data ) {    
        console.log('found book!!!');
        console.log(data);
        callback(data);
    })
    .fail(function (err) {
        console.error(err);
    })
}
// add a user book
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
        console.log(data);
        $('.book-result-dialog').append(`<h3 id="successInfo" style="color: #5cb85c">Added ${book.title} to your Shelf!</h3>`);
    })
    .fail(function (err) {
        console.log(err);
        $('.book-result-dialog').append(`<h3 id="warningInfo" style="color: #d43f3a">${err.statusText}</h3>`);
    })
}
// update or add a book
function updateBook(book) {
}

function deleteBook(isbn) {
    $.ajax({
       url: '/api/users/books/${isbn}',
       type: 'DELETE',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')}
    })
    .done(function( data ) {
        console.log(data);
        console.log('Deleted book');
    })
    .fail(function (err) {
        console.log(err);
    })
}
    
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
    
function addAuthToken(authToken) {
    sessionStorage.setItem('token', authToken);
    $(`<h3 style="color:#5cb85c">Token refreshed!</h3>`).insertAfter('header').delay(3000).fadeOut();
}
    
    
})