'use strict';

const express = require('express');
const axios = require('axios');
const router = express.Router();

// Return top 5 search results
router.get('/:searchStr', async (req, res) => {
    try {
        const initResults = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.params.searchStr}&projection=lite&key=${process.env.GOOGLE_API_KEY}&maxResults=10`);
        const items = initResults.data.items;
        let volumes = [];
        for (let i=0; i<items.length; i++ ) {
            const book = items[i];
            const details = await axios.get(book.selfLink);
            let isbn;
            const { industryIdentifiers, imageLinks } = details.data.volumeInfo;
            if (industryIdentifiers) {
                isbn = industryIdentifiers.find(i=>i.type === 'ISBN_13').identifier;
            } else {
                isbn = book.id;
            }

            let secureImgLinks = {};
            if (imageLinks) {
                // Convert any http imgLinks to https
                Object.keys(imageLinks).forEach(key => {
                    if (imageLinks[key].startsWith('http')) {
                        secureImgLinks[key] = imageLinks[key].replace('http', 'https');
                    } else {
                        secureImgLinks[key] = imageLinks[key];
                    }
                });
            }

            const volume = {
                id: book.id,
                selfLink: book.selfLink,
                volumeInfo: {
                    ...book.volumeInfo,
                    imageLinks: secureImgLinks,
                },
                isbn: isbn
            }
            volumes.push(volume);
        }
        return res.json(volumes);

    } catch (e) {
        console.error(e);
        return res.sendStatus(500);
    }
});

module.exports = { router };
