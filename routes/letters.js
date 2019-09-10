const express = require('express');
const router = express.Router();
const fs = require('fs');
const utils = require('./utilities');

const lettersGroup = '27034531@N00';
const reg = /^[a-z]+$/i;
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

router.get('/', function(req, res, next) {
  alphabet.forEach(letter => {
    utils.getPhotoCollection(process.env.FLICKR_KEY, lettersGroup, letter);
  });

  res.send('Finished downloading all letter photos');
});

router.get('/:letter', function(req, res, next) {
  const letter = req.params['letter'];

  if (!reg.test(letter)) {
    const error = new Error(`${letter} is not a letter`);
    return next(error);
  } else {
    fs.readFile(`./datastore/${letter}.json`, 'utf8', function(err, data) {
      if (err) {
        next(err); // Pass errors to Express.
      }
      var photosArray = JSON.parse(data)['photos']['photo'];
      var numberOfPhotos = photosArray.length;
      let randomIndex = Math.floor(Math.random() * numberOfPhotos);
      let photo = photosArray[randomIndex];
      let flickrUrl = utils.constructStaticFlickrUrl(
        photo.farm,
        photo.server,
        photo.secret,
        photo.id
      );
      res.send({
        url: flickrUrl
      });
    });
  }
});

module.exports = router;
