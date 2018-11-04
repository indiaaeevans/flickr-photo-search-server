var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request');

const flickrPhotoSearchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';

constructStaticFlickrUrl = (farm, server, secret, id) => {
  return 'http://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '.jpg';
}

router.get('/:letter', function (req, res, next) {
  const letter = req.params['letter'];
  const lettersGroup = '27034531@N00';
  var reg = /^[a-z]+$/i;

  if (!reg.test(letter)) {
    res.send(`${letter} is not a letter`);
  } else {
    let options = {
      url: flickrPhotoSearchUrl,
      qs: {
        format: 'json',
        nojsoncallback: '1',
        api_key: process.env.flickrKey,
        group_id: lettersGroup,
        tags: letter
      }
    }
    let fileStream = fs.createWriteStream(`./datastore/${letter}.json`);

    request.get(options).pipe(fileStream)
      .on('finish', function () {
        res.send('Finished downloading photos matching letter ' + letter);
      });
  }
});

router.get('/random/:letter', function (req, res, next) {
  const letter = req.params['letter'];
  // get photos for this letter from datastore
  fs.readFile(`./datastore/${letter}.json`, 'utf8', function (err, data) {
    if (err) throw err;
    var photosArray = JSON.parse(data)['photos']['photo'];
    var numberOfPhotos = photosArray.length;
    // randomly select a photo
    let randomIndex = Math.floor(Math.random() * numberOfPhotos + 1)
    let photo = photosArray[randomIndex];
    // send back static url for displaying on page
    res.send({ url: constructStaticFlickrUrl(photo.farm, photo.server, photo.secret, photo.id) });
  });
});

module.exports = router;