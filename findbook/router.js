'use strict';

const express = require('express');
const axios = require('axios');
const router = express.Router();

// Return top 5 search results
router.get('/:searchStr', async (req, res) => {
    try {
        const initResults = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.params.searchStr}&projection=lite&key=${process.env.GOOGLE_API_KEY}&maxResults=5`);
        const items = initResults.data.items;
        let volumes = [];
        for (let i=0; i<items.length; i++ ) {
            const book = items[i];
            const details = await axios.get(book.selfLink);
            const isbn_13 = details.data.volumeInfo.industryIdentifiers.find(i=>i.type === 'ISBN_13').identifier;
            const volume = {
                id: book.id,
                selfLink: book.selfLink,
                volumeInfo: book.volumeInfo,
                isbn: isbn_13
            }
            volumes.push(volume);
        }
        return res.json(volumes);

    } catch (e) {
        console.error(e);
    }
});

module.exports = { router };
