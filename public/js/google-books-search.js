const GOOGLE_API_KEY = "AIzaSyAOmOmwmXQXzBOvc2Cu7kEjZIkZMwvXPBQ";

function searchAllVolumes(searchString, callback) {
    $.ajax( {
        url: `https://www.googleapis.com/books/v1/volumes?q=${searchString}&key=${GOOGLE_API_KEY}`,
        dataType: 'json', 
        data: {
            maxResults: 40
        }
    })
    .done(function( data ) {
        console.log(data);
        callback(data);
    })
    .fail(function( err) {
        console.log(err);
    })
}

function searchSingleVolume(id) {
    $.ajax( {
        url: `https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_API_KEY}`,
        dataType: 'json', 
        data: {}
    })
    .done(function( data ) {
        console.log(data);
    })
    .fail(function (err) {
        console.log(err);
    })
};

