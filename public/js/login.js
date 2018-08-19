
// authenticate user after login form is submitted
$('.login-form').submit(function(event) {
    event.preventDefault();
        
    // get and set jwt to sessionStorage
    authenticateUser();
});