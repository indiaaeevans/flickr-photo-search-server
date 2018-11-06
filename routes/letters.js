var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');

const flickrPhotoSearchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
const lettersGroup = '27034531@N00';
const reg = /^[a-z]+$/i;
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

router.get('/', function (req, res, next) {

  alphabet.forEach((letter) => {
    getPhotoCollection(process.env.flickrKey, lettersGroup, letter);
  })

  res.send('Finished downloading all letter photos');
});

router.get('/:letter', function (req, res, next) {
  const letter = req.params['letter'];

  if (!reg.test(letter)) {
    const error = new Error(`${letter} is not a letter`)
    return next(error)
  } else {
    fs.readFile(`./datastore/${letter}.json`, 'utf8', function (err, data) {
      if (err) {
        next(err); // Pass errors to Express.
      }
      var photosArray = JSON.parse(data)['photos']['photo'];
      var numberOfPhotos = photosArray.length;
      let randomIndex = Math.floor(Math.random() * numberOfPhotos + 1)
      let photo = photosArray[randomIndex];
      let flickrUrl = constructStaticFlickrUrl(photo.farm, photo.server, photo.secret, photo.id);
      res.send({
        url: flickrUrl
      });
    });
  }
});

function getPhotoCollection(key, group, tag) {
  let options = {
    url: flickrPhotoSearchUrl,
    qs: {
      format: 'json',
      nojsoncallback: '1',
      api_key: key,
      group_id: group,
      tags: tag
    }
  }
  let fileStream = fs.createWriteStream(`./datastore/${tag}.json`);

  request.get(options).pipe(fileStream)
    .on('finish', function () {
      console.log('Finished downloading photos matching tag: ' + tag);
    });
}

function constructStaticFlickrUrl(farm, server, secret, id) {
  return `http://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
}

module.exports = router;