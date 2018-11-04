var express = require('express');
var router = express.Router();
var request = require('request');
const flickrPhotoSearchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';

router.get('/:number', function (req, res, next) {
    const number = req.params['number'];
    const reg = /^[0-9]+$/;
    let createResponse = (error, response, body) => {
        let photos = JSON.parse(body)['photos']['photo'];
        res.send(photos);
    }

    if (!reg.test(number)) {
        res.send(`${number} is not a number`);
    } else {
        let options = {
            url: flickrPhotoSearchUrl,
            qs: {
                format: 'json',
                nojsoncallback: '1',
                api_key: process.env.flickrKey,
                group_id: '54718308@N00',
                tags: number
            }
        }
        request.get(options, createResponse);
            //.pipe(res);
    }
});

router.get('/random/:number', function (req, res, next) {
    const number = req.params['number'];
    const numbersGroup = '54718308@N00';
    var reg = /^[0-9]+$/;
    message = reg.test(number) ? `${number} is a number` : `${number} is not a number`;
    res.send(message);
});

module.exports = router;