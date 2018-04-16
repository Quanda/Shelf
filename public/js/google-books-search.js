const GOOGLE_API_KEY = "AIzaSyAOmOmwmXQXzBOvc2Cu7kEjZIkZMwvXPBQ";

function searchAllVolumes(searchString, callback) {
    $.ajax( {
        url: `https://www.googleapis.com/books/v1/volumes?q=${searchString}&projection=lite&key=${GOOGLE_API_KEY}`,
        dataType: 'json', 
        data: {
            maxResults: 40
        }
    })
    .done(function( data ) {
        callback(data);
    })
    .fail(function( err) {
        console.error(err);
    })
}

function searchSingleVolume(id, callback) {
    $.ajax( {
        url: `https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_API_KEY}`,
        dataType: 'json', 
        data: {}
    })
    .done(function( data ) {
        callback(data);
    })
    .fail(function (err) {
        console.error(err);
    })
};

