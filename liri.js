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
var liriResults = process.argv.slice(3).join(" ");

// liri.js commands
function liriSearch() {
  if (command === "concert-this") {
    ConcertThis();
  } else if (command === "spotify-this-song") {
    SpotifyThisSong();
  } else if (command === "movie-this") {
    MovieThis();
  } else if (command === "do-what-it-says") {
    fs.readFile("./random.txt", "utf-8", function(err, data) {
      if (err) {
        console.log("I dont know what just happened!");
      }
      (command = data.substring(0, data.indexOf(","))),
        (liriResults = data.substring(data.indexOf(",") + 2, data.length - 1));
      liriSearch();
    });
  } else {
    console.log("Enter a valid command");
  }
}

//Function for 'concert-this'
function ConcertThis() {
  console.log("ConcertThis says liriResults is: ");
  if (liriResults == "") {
    console.log("You must include an artist to search.");
  } else {
    axios
      .get(
        "https://rest.bandsintown.com/artists/" +
          liriResults +
          "/events?app_id=codingbootcamp"
      )
      .then(function(response) {
        var results = response.data;
        for (i = 0; i < results.length; i++) {
          var venue = results[i].venue.name;
          if (results[i].country === "Australia") {
            var location =
              results[i].venue.city + ", " + results[i].venue.location;
          } else {
            results[i].venue.city + ", " + results[i].venue.country;
          }
          var date = moment(results[1].datetime);
          date = date.format("DD/MM/YYYY");
          var output =
            "\nVenue: " +
            venue +
            "\nLocation: " +
            location +
            "\nDate: " +
            date +
            "\n-----------------";
          console.log(output);
          fs.appendFile("log.txt", output, "utf-8", function(err) {
            if (err) {
              console.log("Sorry! Couldn't log your results.");
            }
          });
        }
        console.log("LIRI has logged your search!");
      });
  }
}

// Function for 'spotify-this-song'
function SpotifyThisSong() {
  console.log("SpotifyThisSong says liriResults is: ");
  if (liriResults == "") {
    liriResults = "The Sign Ace of Base";
  }
  spotify.search(
    {
      type: "track",
      query: liriResults
    },
    function(err, data) {
      if (err) {
        return console.log("Error occurred finding your song");
      }
      var results = data.tracks.items[0];
      var artist = results.artists[0].name;
      var name = results.name;
      var preview = results.preview_url;
      var album = results.album.name;
      var output =
        "\nArtist: " +
        artist +
        "\nSong Name: " +
        name +
        "\nPreview Link: " +
        preview +
        "\nAlbum: " +
        album +
        "\n---------------------------------";
      console.log(output);
      fs.appendFile("log.txt", output, "utf8", function(err) {
        if (err) {
          console.log("Sorry! Couldn't log your results.");
        }
        console.log("LIRI has logged your search!");
      });
    }
  );
}

function MovieThis() {
  if (liriResults === "") {
    liriResults = "Mr. Nobody";
  }
  axios
    .get("http://www.omdbapi.com/?apikey=trilogy&t=" + liriResults)
    .then(function(response) {
      console.log(response.data.Title);
      results = response.data;
      var title = results.Title;
      var year = results.Year;
      ratingsArr = results.Ratings;
      var IMDB = ratingsArr
        .filter(function(item) {
          return item.Source === "Internet Movie Database";
        })
        .map(function(item) {
          return item.Value.toString();
        });
      IMDB = IMDB.toString();
      var RT = ratingsArr
        .filter(function(item) {
          return item.Source === "Rotten Tomatoes";
        })
        .map(function(item) {
          return item.Value.toString();
        });
      RT = RT.toString();
      country = results.Country;
      language = results.Language;
      plot = results.Plot;
      actors = results.Actors;
      var output =
        "\nTitle: " +
        title +
        "\nYear: " +
        year +
        "\nIMDB Rating: " +
        IMDB +
        "\nRotten Tomatoes Rating: " +
        RT +
        "\nCountry: " +
        country +
        "\nLanguage: " +
        language +
        "\nPlot: " +
        plot +
        "\nActors: " +
        actors +
        "\n---------------------------------";
      console.log(output);
      fs.appendFile("log.txt", output, "utf8", function(err) {
        if (err) {
          console.log("Sorry! Couldn't log your results.");
        }
        console.log("LIRI has logged your search!");
      });
    });
}

liriSearch();
