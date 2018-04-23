// invoke functions
$(function() {
    displayBooks();
})

const MOCK_BOOKS = {
    "books": [
        {
            "id": "1111111",
            "title": "mock book 1",
            "author": "mock author 1",
            "isbn": 1111111111,
            "description": "mock desc 1",
            "book_added": "2018-04-01",
            "book_modified": "2018-04-02",
            "rating_avg": 0,
            "rating_user": 3,
            "image_link": "./defaultBook.png"
        },
        {
            "id": "2222222",
            "title": "mock book 2",
            "author": "mock author 2",
            "isbn": 2222222222,
            "description": "mock desc 2",
            "book_added": "2018-04-02",
            "book_modified": "2018-04-03",
            "rating_avg": 1,
            "rating_user": 1,
            "image_link": "./defaultBook.png"
        },
        {
            "id": "333333",
            "title": "mock book 3",
            "author": "mock author 3",
            "isbn": 3333333333,
            "description": "mock desc 3",
            "book_added": "2018-04-03",
            "book_modified": "2018-04-04",
            "rating_avg": 2,
            "rating_user": 4,
            "image_link": "./defaultBook.png"
        },
        {
            "id": "4444444",
            "title": "mock book 4",
            "author": "mock author 4",
            "isbn": 444444444,
            "description": "mock desc 4",
            "book_added": "2018-04-04",
            "book_modified": "2018-04-05",
            "rating_avg": 3,
            "rating_user": 2,
            "image_link": "./defaultBook.png"
        }
    ]
};

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
    searchSingleVolume(selectedBookId, renderVolume)
});
// gets bookId, looks up book, calls addToShelf fn
$('.book-result-dialog').on('click', '.add-to-shelf-btn', function() {
    let selectedBookId = $(this).parent().attr('id');
    console.log(selectedBookId);
    searchSingleVolume(selectedBookId, addToShelf);
});
$('.book-result-dialog').on('click', '.view-books-btn', function() {
    getAndDisplayBooks();
});
$('.book-result-dialog').on('click', '.book-result-close', function() {
    $('.book-result-dialog').html('');
    $('.book-result-dialog').addClass('hidden');
});
// render user book
$('.user-books').on('click', '.result', function() {
    const selectedBookId = $(this).attr('id');
    const userBook = MOCK_BOOKS.books.find( x => x.id === selectedBookId);
    console.log(userBook);
    $('.book-result-dialog').removeClass('hidden');
    renderBook(userBook);
})


$('#login').submit(function(event) {
    event.preventDefault();
    
    // ensure username and password are supplied 
    
    // get and set jwt to sessionStorage
    authenticateUser();
})


$('.view-shelf-btn').on('click', function() {
    console.log('clicked view shelf');    
    
    // request books and redirect to home.html
    getAndDisplayBooks();
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

// render the users books in the view
function renderBooks(data) {
    data.books.forEach( (book) => {
        console.log(book.image_link);
        let userBook = 
        `<div class="result" id="${book.id}">
            <img src="${book.image_link}" alt="book image"/>
            <p> ${book.title}</p>
            <h5>by ${book.author}</h5>
        </div>`
        
        $('.user-books').append(userBook);
    })
}

function renderBook(book) {
    let bookHtml = `
    <div class="user-book" id="${book.id}">
        <a class="close-btn"></a>
        <img src="${book.image_link}" alt="volume image"/>
        <p> ${book.title}</p>
        <h5>by ${book.author}</h5>
        <p>${book.description}</p>
    </div>`
    $('.book-result-dialog').html('');
    $('.book-result-dialog').html(bookHtml);
}

// builds book object, calls api to create new book
function addToShelf(book) {
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
        "id": "",
        "title": book.volumeInfo.title,
        "author": book.volumeInfo.authors[0],
        "isbn": book.volumeInfo.industryIdentifiers[isbn_index].identifier,
        "description": book.volumeInfo.description,
        "book_added": Date.now(),
        "book_modified": Date.now(),
        "rating_avg": book.volumeInfo.averageRating || 'None',
        "rating_user": 0,
        "image_link": imageLink
    }
    // CALL API ENDPOINT TO CREATE BOOK
    console.log(bookObj);
    MOCK_BOOKS.books.push(bookObj);
    console.log(MOCK_BOOKS.books);
}


// API CALLS
function getAllBooks(callbackFn) {
    //setTimeout(function(){ callbackFn(MOCK_BOOKS)}, 1000);
    
    // ajax call to API to get books 
}

function authenticateUser() {
    $.ajax({
       url: '/api/auth/login',
       type: 'POST',
       data: {username: $('#username').val(), password: $('#password').val()},
       dataType: 'JSON'
    })
    .done(function( data ) {
        $('.auth-warning').removeClass('warning-on').text('');
        sessionStorage.setItem('token', data.token);
        $('.view-shelf-btn').removeClass('hidden');
        $('.login-btn').addClass('hidden');
        console.log('authenticated...');
    })
    .fail(function (err) {
        console.error(err);
        $('.view-shelf-btn').addClass('hidden');
        $('.auth-warning').addClass('warning-on').text(err.responseText);
    })
}

// empty shelf view and populate with latest books
function getAndDisplayBooks() {
    $.ajax({
       url: '/api/users/books',
       type: 'GET',
       headers: {"Authorization": 'Bearer ' + sessionStorage.getItem('token')},
       dataType: 'JSON'
    })
    .done(function( data ) {
        console.log('retrieving books...')
        console.log(data);
        // display books homepage, pass data
        // how to render homepage with user books from data
        displayBooks(data);
    })
    .fail(function (err) {
        console.error(err);
    });
}

function displayBooks(data) {
    $('.user-books').children().remove();
    $('.add-book-background').addClass('hidden');
    $('.add-book-dialog').addClass('hidden');
    $('.book-result-dialog').addClass('hidden'); 
}