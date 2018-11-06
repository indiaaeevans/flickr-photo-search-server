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
    res.send(`${letter} is not a letter`);
  } else {

    // get photos for this letter from datastore
    fs.readFile(`./datastore/${letter}.json`, 'utf8', function (err, data) {
      if (err) throw err;
      var photosArray = JSON.parse(data)['photos']['photo'];
      var numberOfPhotos = photosArray.length;
      // randomly select a photo
      let randomIndex = Math.floor(Math.random() * numberOfPhotos + 1)
      let photo = photosArray[randomIndex];
      // send back static url for displaying on page
      res.send({
        url: constructStaticFlickrUrl(photo.farm, photo.server, photo.secret, photo.id)
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
  return 'http://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '.jpg';
}

module.exports = router;