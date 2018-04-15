console.log('running app.js');

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
            "rating": 0
        },
        {
            "id": "2222222",
            "title": "mock book 2",
            "author": "mock author 2",
            "isbn": 2222222222,
            "description": "mock desc 2",
            "book_added": "2018-04-02",
            "book_modified": "2018-04-03",
            "rating": 1
        },
        {
            "id": "333333",
            "title": "mock book 3",
            "author": "mock author 3",
            "isbn": 3333333333,
            "description": "mock desc 3",
            "book_added": "2018-04-03",
            "book_modified": "2018-04-04",
            "rating": 2
        },
        {
            "id": "4444444",
            "title": "mock book 4",
            "author": "mock author 4",
            "isbn": 444444444,
            "description": "mock desc 4",
            "book_added": "2018-04-04",
            "book_modified": "2018-04-05",
            "rating": 3
        }
    ]
};

//handle add book button click
// display modal
$('#add-book-btn').on('click', function() {
    $('.add-book-background').removeClass('hidden');
    $('.add-book-dialog').removeClass('hidden');
})

// handle escaping add book
// hide modal
$('.add-book-background, #close-add-book-btn').on('click', function() {
    $('.add-book-background').addClass('hidden');
    $('.add-book-dialog').addClass('hidden');
})
// handle searching all volumes
$('.add-book-form').on('submit', function(event) {
    event.preventDefault();
    const SEARCH_STRING = $('#book-search').val();
    console.log(SEARCH_STRING);
    $('.book-searchresults-accordion').children().remove();
    searchAllVolumes(SEARCH_STRING, renderBookResults)
})

let renderBookResults = function(bookResults) {    
    bookResults.items.forEach( (book) => {
        let author;
        if(typeof book.volumeInfo.authors != 'undefined') {
            author = book.volumeInfo.authors[0]
        } else {
            author = 'No author listed'
        }
        let bookResultItem = `
            <li>
                <a class="toggle" href="javascript:void(0);">${book.volumeInfo.title} - ${author}</a>
                <div class="book inner">
                    <a class="book-searchresult-backout" href="#">Back</a>
                    <h2>${book.volumeInfo.title}</h2>
                </div>
            </li>`
        $('.book-searchresults-accordion').append(bookResultItem);
    })
    $('.book.inner').removeClass('show').slideUp(350);
}

function getAllBooks(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_BOOKS)}, 100);
    
    // ajax call to API to get books
}

// this function stays the same when we connect
// to real API later
function displayAllBooks(data) {
    for (index in data.books) {
       $('.user-books').append(
        '<p>' + data.books[index].title + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayBooks() {
    getAllBooks(displayAllBooks);
}

$(function() {
    getAndDisplayBooks();
})