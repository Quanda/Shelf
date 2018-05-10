# Shelf
https://desolate-forest-17713.herokuapp.com/

## Summary
Thinkful captone project. Users can register an account and begin managing books on their shelf. Supports basic CRUD operations. Users can:
* Create - Add books to shelf
* Read Get information about books from their shelf
* Update Update their rating for books on their Shelf
* Delete Delete books from shelf

## Build with
* NodeJS
* ExpressJS
* MongoDB
* MongooseJS
* PassportJS
* ES6
* See package.json for more

## APIs and Libraries
[Google Books API](https://developers.google.com/books/docs/v1/using) <br>
[JQuery](https://api.jquery.com/) <br>
[Bootstrap](https://getbootstrap.com/docs/4.1/getting-started/introduction/) <br>

## Features
* JSON Web Token (JWT) authentication supports registration and sign on
* Manage User shelf directly using the API endpoints

## Using the API

### Authentication / Login
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/auth/login
Bearer Authentication with JSON Web Token
Must supply valid Username and Password in request header
If authentication suceeds, a valid 7d expiry JWT will be provided in response body

### Register New User
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/users <br>
Must supply Fullname, Username and Password in request body <br>
If successful, a valid 7d expiry JWT will be provided in response body <br>

### Get All Books
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/users/books <br>
This endpoint retrieves all books from user Shelf <br>
Must supply valid JWT via Bearer Authentication <br>
If authentication suceeds, all User books will be returned <br>

### Get Single Book
##### GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/users/books/{ISBN-GOES-HERE} <br>
This endpoint retrieves a single book from user Shelf <br>
Supply ISBN as route parameter <br>
Must supply valid JWT via Bearer Authentication <br>
If authentication suceeds, single User books will be returned <br>

### Add Book
##### POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/users/books <br>
This endpoint adds a single book to user Shelf <br>
Supply book object in request body <br>
Must supply valid JWT via Bearer Authentication <br>

### Update Book
##### PUT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/users/books/{ISBN-GOES-HERE} <br>
This endpoint updates a single book in user Shelf <br>
Supply ISBN as route parameter <br>
Supply book object in request body <br>
Must supply valid JWT via Bearer Authentication <br>

### Delete Book
##### DELETE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/api/users/books/{ISBN-GOES-HERE} <br>
This endpoint deletes a single book from user Shelf <br>
Supply ISBN as route parameter <br>
Must supply valid JWT via Bearer Authentication <br>

## DEMO
[LIVE DEMO]()

## Screenshots
[Splash page](https://postimg.cc/image/vk18ugngl/)

[Shelf Homepage](https://postimg.cc/image/spy3h18fp/)

[Add Book page](https://postimg.cc/image/spy3h0t05/)

[Screen showing book data with update rating and delete book functionality](https://postimg.cc/image/dtzk9fpb9/)
