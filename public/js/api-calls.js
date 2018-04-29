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


function updateSessionStorageWithBooks(data) {
    data.books.forEach( (book, index) => {
        sessionStorage.setItem(data.books[index].isbn, JSON.stringify(data.books[index]));
    })
}