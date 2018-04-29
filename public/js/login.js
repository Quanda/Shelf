
$('.login-form').submit(function(event) {
    event.preventDefault();
    
    // ensure username and password are supplied 
    
    // get and set jwt to sessionStorage
    authenticateUser();
})

$('.proceed-form').submit(function(event) {  
    event.preventDefault();
    
    // update storage with user books
    getUserBooks(updateSessionStorageWithBooks);
    
    // render home page
    window.location.replace("/home.html");
})

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
        $('.proceed-btn').removeClass('hidden');
        $('.login-btn').addClass('hidden');
    })
    .fail(function (err) {
        console.log(err);
        $('.proceed-btn').addClass('hidden');
        $('.auth-warning').addClass('warning-on').text(`${err.responseText}`);
    })
}

