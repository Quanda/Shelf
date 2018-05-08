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

// handle user submitting proceed form after successful signup
$('.proceed-form').submit(function(event) {  
    event.preventDefault();
    
    // render login page
    window.location.replace("/login.html")
})
