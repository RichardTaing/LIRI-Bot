// Read and set environment variables.
require("dotenv").config();

// vars.
var keys = require("./keys.js");
var Spotify = require("node-spotify-api"); //Using the Spotify api and getting the key from keys.js
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
moment().format();
var axios = require("axios"); //To get the information from the APIs for movie and concert-this
var fs = require("fs"); //To read the random.txt file for the do-what-it-says function

// vars to capture user inputs.
var command = process.argv[2];
var value = process.argv[3];

switch (command) {
  case "concert-this":
    concertThis(value);
    break;
  case "spotify-this-song":
    spotifySong(value);
    break;
  case "movie-this":
    movieThis(value);
    break;
  case "do-what-it-says":
    doThis(value);
    break;
}
