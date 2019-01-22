var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');
const utils = require('./utilities');

const flickrPhotoSearchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
const numbersGroup = '54718308@N00';
var reg = /^[0-9]+$/;
const numbers = '0123456789'.split('');

router.get('/', function (req, res, next) {

    numbers.forEach((number) => {
        utils.getPhotoCollection(process.env.flickrKey, numbersGroup, number);
    })

    res.send('Finished downloading all number photos');
});

router.get('/:number', function (req, res, next) {
    const number = req.params['number'];

    if (!reg.test(number)) {
        const error = new Error(`${number} is not a number`)
        return next(error)
    } else {
        fs.readFile(`./datastore/${number}.json`, 'utf8', function (err, data) {
            if (err) {
                next(err); // Pass errors to Express.
            }
            var photosArray = JSON.parse(data)['photos']['photo'];
            var numberOfPhotos = photosArray.length;
            let randomIndex = Math.floor(Math.random() * numberOfPhotos)
            let photo = photosArray[randomIndex];
            let flickrUrl = utils.constructStaticFlickrUrl(photo.farm, photo.server, photo.secret, photo.id);
            res.send({
                url: flickrUrl
            });
        });
    }
});

module.exports = router;