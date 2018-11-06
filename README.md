# Ransom Note Generator
![ransom note example](https://user-images.githubusercontent.com/22288641/48041773-c2658f80-e14c-11e8-95b1-e43bcfc33141.png)

The app will take a simple text input (letters only--numbers and symbols coming soon) and display it as a ransom note using photos hosted on Flickr.

# Background

In typography, the ransom note effect is the result of using an excessive number of juxtaposed typefaces. It takes its name from the appearance of a stereotypical ransom note, with the message formed from words or letters cut randomly from a magazine or newspaper in order to avoid using recognizable handwriting.

Source: https://en.wikipedia.org/wiki/Ransom_note_effect

# Connecting to Flickr API
Get a Flickr API key here: https://www.flickr.com/services/apps/create/

Add your API key and secret to a .env file in the app directory as follows:

flickrKey = <your key here>
flickrSecret = <your secret here>

# Creating collections for each letter, number, or symbol
The Flickr API provides a flickr.photos.search method to return a list of photos matching some criteria.  In our case we will search within specific groups on Flickr and filter by tag.

The body of the API response is streamed into a JSON file, with a name corresponding to whichever letter, number, or symbol was requested.

To create the collections for each letter (numbers and symbols coming soon), hit the endpoint: localhost:3000/letters


# Parsing user input and retrieving photos
We will retrieve the details for individual photos from the datastore we created in the previous step. First we have to split the user input into individual characters.  Then, for each letter, number, or symbol in the message, we retrieve a random photo from the corresponding JSON file. This time, we use the endpoint: localhost:3000/letters/<letter>

# Constructing the image source URL
With the data for each photo, we construct a source URL out of its ID, server ID, farm ID, and secret. The URL can then be used in the src attribute of an HTML \<img\> tag.

Flickr photo source URLs are constructed as follows:
https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg

Documentation: https://www.flickr.com/services/api/misc.urls.html

# See it in action
After running the app and creating the collections of photos, go to localhost:3000/ and create your own ransom note!
