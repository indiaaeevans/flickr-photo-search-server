const express = require('express');
const router = express.Router();
const fs = require('fs');
const utils = require('./utilities');

const symbolsGroup = '34231816@N00';
const symbols = [
  'exclamation',
  'ampersand',
  'questionmark',
  'period',
  'hash',
  'percent',
  'plus',
  'equals',
  'comma',
  'apostrophe',
  'slash',
  'quote',
  'asterisk',
  'dollar'
];

router.get('/', function(req, res, next) {
  symbols.forEach(symbol => {
    utils.getPhotoCollection(process.env.FLICKR_KEY, symbolsGroup, symbol);
  });

  res.send('Finished downloading all symbol photos');
});

router.get('/:symbol', function(req, res, next) {
  const symbol = req.params['symbol'];

  if (symbols.indexOf(symbol) === -1) {
    const error = new Error(`${symbol} is not a symbol`);
    return next(error);
  } else {
    fs.readFile(`./datastore/${symbol}.json`, 'utf8', function(err, data) {
      if (err) {
        next(err); // Pass errors to Express.
      }
      var photosArray = JSON.parse(data)['photos']['photo'];
      var numberOfPhotos = photosArray.length;
      let randomIndex = Math.floor(Math.random() * numberOfPhotos);
      let photo = photosArray[randomIndex];
      if (photo) {
        let flickrUrl = utils.constructStaticFlickrUrl(
          photo.farm,
          photo.server,
          photo.secret,
          photo.id
        );
        res.send({
          url: flickrUrl
        });
      } else {
        res.send(404, 'error getting flickr URL for ' + symbol);
      }
    });
  }
});

module.exports = router;
