const request = require('request');
const fs = require('fs');

const flickrPhotoSearchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';

let utils = module.exports;

utils.getPhotoCollection = function (key, group, tag) {
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

utils.constructStaticFlickrUrl = function (farm, server, secret, id) {
    return `http://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
}