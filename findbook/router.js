'use strict';

const express = require('express');
const axios = require('axios');
const router = express.Router();
const GOOGLE_API_KEY = "AIzaSyAOmOmwmXQXzBOvc2Cu7kEjZIkZMwvXPBQ";


router.get('/:searchStr', (req, res) => {

    // search google books api and return top 5 results
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.params.searchStr}&projection=lite&key=${GOOGLE_API_KEY}&maxResults=5`)
    .then((response) => {
        let volumes = response.data.items.map( volume => {
            return {
                id: volume.id,
                selfLink: volume.selfLink,
                volumeInfo: volume.volumeInfo
            }
        })
        return res.json(volumes)
    })
    .catch(e => console.error(e))
});

module.exports = { router };