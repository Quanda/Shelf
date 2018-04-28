// handle user submitting registration form
$('.signup-form').submit(function(event) {
    event.preventDefault();
    console.log('clicked signup button');
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


function registerUser(user) {
    console.log('running registerUser');
    console.log(user);
    $.ajax({
       url: '/api/users',
       type: 'POST',
       data: JSON.stringify(user),
       contentType: 'application/json',
       dataType: 'JSON'
    })
    .done(function( data ) {
        console.log(data);
        console.log('registered user...');
    })
    .fail(function (err) {
        console.error(err);
    })
}