console.log('running app.js')

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

function getAllBooks(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_BOOKS)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayAllBooks(data) {
    for (index in data.books) {
       $('body').append(
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