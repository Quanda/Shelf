
// invoke functions
handleAccordionToggle();

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
            "rating_user": 3
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
            "rating_user": 1
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
            "rating_user": 4
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
            "rating_user": 2
        }
    ]
};

//handle add book button click on homepage
// display the add book interface
$('#add-book-btn').on('click', function() {
    $('.add-book-background').removeClass('hidden');
    $('.add-book-dialog').removeClass('hidden');
})

// handle escaping from add book
// hide modal
$('.add-book-background, #close-add-book-btn').on('click', function() {
    $('.add-book-background').addClass('hidden');
    $('.add-book-dialog').addClass('hidden');
})
// user submits search for book
// get book results from google api and call renderAllVolumes fn
$('.add-book-form').on('submit', function(event) {
    event.preventDefault();
    const SEARCH_STRING = $('#book-search').val();
    $('.book-searchresults-accordion').children().remove();
    searchAllVolumes(SEARCH_STRING, renderAllVolumes)
})

// renders all books returned from query in accordion
let renderAllVolumes = function(bookResults) {    
    bookResults.items.forEach( (book) => {
        let author, description, imageLink;
        if(typeof book.volumeInfo.authors != 'undefined') {
            author = book.volumeInfo.authors[0];
        } else {
            author = 'No author listed'
        }
        if(typeof book.volumeInfo.description != 'undefined') {
            description = book.volumeInfo.description;
        } else {
            description = 'No description listed'
        }
        if(typeof book.volumeInfo.imageLinks != 'undefined') {
            let imageLink = book.volumeInfo.imageLinks.smallThumbnail;
        } else {
            console.log(`no image link for ${book}`);
        }
        
        let bookResultItem = `
            <li>
                <a class="toggle" href="javascript:void(0);">${book.volumeInfo.title} - ${author}</a>
                <div class="book inner">
                    <h2 id="${book.id}">${book.volumeInfo.title}</h2>
                    <h5>by ${author}</h5>
                    <!--<img src="${imageLink}" alt="book image" />-->
                    <p>${description}</p>
                    <button class="add-to-shelf-btn">Add to Shelf</button>
                </div>
            </li>`
        $('.book-searchresults-accordion').append(bookResultItem);
    })
    $('.book.inner').removeClass('show').slideUp(350);
}

// gets bookId, looks up book, calls addToShelf fn, rerender shelf
$('.book-searchresults-accordion').on('click', '.add-to-shelf-btn', function() {
    let selectedBookId = $(this).siblings('h2').attr('id');
    searchSingleVolume(selectedBookId, addToShelf)
    getAndDisplayBooks();
})

// builds book object, calls api to create new book
function addToShelf(book) {
    console.log(book)
    let bookObj = {
        "title": book.volumeInfo.title,
        "author": book.volumeInfo.authors[0] || 'No author listed',
        "isbn": book.volumeInfo.industryIdentifiers[0].identifier,
        "description": book.volumeInfo.description || 'No description listed',
        "book_added": Date.now(),
        "book_modified": Date.now(),
        "rating_avg": book.volumeInfo.averageRating || 'No average listed',
        "rating_user": 0
    }
    // CALL API ENDPOINT TO CREATE BOOK
    console.log(bookObj);
    MOCK_BOOKS.books.push(bookObj);
    console.log(MOCK_BOOKS.books);
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

// empty shelf and retrieve latest books
function getAndDisplayBooks() {
    $('.user-books').children().remove();
    getAllBooks(displayAllBooks);
}

$(function() {
    getAndDisplayBooks();
})


// performs accordion toggle
function handleAccordionToggle() {
    $('.book-searchresults-accordion').on('click', '.toggle', function(event) {
        event.preventDefault();

        let $this = $(this);
        if ($this.next().hasClass('show')) {
            $this.next().removeClass('show');
            $this.next().slideUp(350);
        } else {
            $this.parent().parent().find('li .inner').removeClass('show');
            $this.parent().parent().find('li .inner').slideUp(350);
            $this.next().toggleClass('show');
            $this.next().slideToggle(350);
        }  
    })
}