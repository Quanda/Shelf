// authenticate user after login form is submitted
$('.login-form').submit(function(event) {
    event.preventDefault();
    
    // ensure username and password are supplied 
    
    // get and set jwt to sessionStorage
    authenticateUser();
})

// redirect to homepage after proceed form is submitted
$('.proceed-form').submit(function(event) {  
    event.preventDefault();
    
    // update storage with user books
    getUserBooks(updateSessionStorageWithBooks);
    
    // render home page
    window.location.replace("/home.html");
})


