// handle user submitting registration form
$('.signup-form').submit(function(event) {
    event.preventDefault();
    const name = $('#fullname').val();
    if(typeof $('#fullname').val() != 'undefined') {
        
    }
    const firstName = $('#fullname').val().split(" ")[0];
    const lastName = $('#fullname').val().split(" ")[1];
    const username = $('#username').val();
    const password = $('#password').val();   
    
    let user = {
        firstName,
        lastName,
        username,
        password
    }
    // call api to register user
    registerUser(user);
})

$('.proceed-form').submit(function(event) {  
    event.preventDefault();
    
    // render login page
    window.location.replace("/login.html")
})

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
        $('.proceed-btn').removeClass('hidden');
    })
    .fail(function (err) {
        console.log(err);
        $('.proceed-btn').addClass('hidden');
        $('.auth-warning').addClass('warning-on').text(`${err.responseJSON.location.toUpperCase()} ${err.responseJSON.message}`);
    })
}