//7. At the top of the liri.js file, add code to read and set any environment variables with the dotenv package:
require("dotenv").config();

//8. Add the code required to import the keys.js file and store it in a variable.
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var moment = require('moment');

var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: '08d81bf62f5d40f89cba8cdf6c99a4bb',
    secret: '6da021356dc14318a6eb79a2b2ef0122'
});

// User Input
var search = process.argv[2];
var term = process.argv.slice(3).join(" ");

function UserInput (search, term) {
    if (search === "concert-this") {
        concertSearch(term);
    } else if (search === "spotify-this-song") {
        spotifySearch(term);
    } else if (search === "movie-this") {
        movieSearch(term);
    } else if (search === "do-what-it-says") {
        readLog();
    } else {
        console.log("Wrong search term. Please use \n 'concert-this' \n 'spotify-this-song' \n 'movie-this' \n 'do-what-it-says'. \n\n")
    }
};
UserInput(search, term);

// concert-this
// spotify-this-song
// movie-this
// do-what-it-says

var divider = "\n---------------------------------------------\n";

// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")

function concertSearch(term) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";

    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var concerts = JSON.parse(body);
            // console.log(concerts[1].datetime);
            // console.log(concerts[1].venue.name);
            // console.log(concerts[1].venue.city);
            // console.log(concerts[1].venue.country);
            for (var i = 0; i < 10; i++) {
                var concertResult = divider + "\n"
                + "------@@@@@ Concert Information @@@@@------" + "\n\n"
                + "Result #" + parseInt(i+1) + "\n" 
                + "Name of the venue: " + concerts[i].venue.name + "\n" 
                + "Venue Location: " + concerts[i].venue.city + ", " + concerts[i].venue.country + "\n" 
                + "Date of the Event: " + moment(concerts[i].datetime).format("MM/DD/YYYY") + "\n" 
                + divider;
                console.log(concertResult);
                fs.appendFile("log.txt", concertResult, (err) => {
                    if (err) throw err;
                    console.log('The "data to append" was appended to file!');
                  });
            };
        } else {
            console.log("Error occurred.");
        }
    });
};



function spotifySearch(term) {
    if(term === undefined || term === " ") {
        term = "The Sign by Ace of Base";
    }
    spotify.search(
        { 
            type: 'track', 
            query: term,
            limit: 5,
        }, 
        function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var songList = data.tracks.items;

        for(var i=0; i < songList.length; i++) {
            var songResult = divider + "\n"
            + "-------@@@@@ Song Information @@@@@------" + "\n\n"
            + "Result #" + parseInt(i+1) + "\n" 
            + "Artist(s): " + songList[i].artists[0].name + "\n" 
            + "Song name: " + songList[i].name + "\n" 
            + "Preview song: " + songList[i].preview_url + "\n" 
            + "Album: " + songList[i].album.name + "\n"
            + divider;
            console.log(songResult);
            fs.appendFile("log.txt", songResult, (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
              });
        }
    //   console.log(data);
    });
};
// * Title of the movie.
// * Year the movie came out.
// * IMDB Rating of the movie.
// * Rotten Tomatoes Rating of the movie.
// * Country where the movie was produced.
// * Language of the movie.
// * Plot of the movie.
// * Actors in the movie.

function movieSearch(term) {
    if(term === undefined || term === " ") {
        term = 'Mr. Nobody.';
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=cae36c1c";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) { 
            var movies = JSON.parse(body);
            var movieResult = divider + "\n"
            + "@@@@@ Movie Information @@@@@" + "\n" 
            + "Title: " + movies.Title + "\n" 
            + "Released Year: " + movies.Year + "\n" 
            + "IMDB Rating: " + movies.imdbRating + "\n" 
            + "Rotten Tomatoes Rating: " + movies.Ratings[1].Value + "\n"
            + "Produced Country: " + movies.Country + "\n"
            + "Langueage Movie: " + movies.Language + "\n"
            + "Plot: " + movies.Plot + "\n"
            + "Actors: " + movies.Actors + "\n"
            + divider;
            // console.log(movies);
            console.log(movieResult);
            console.log(movies);
            fs.appendFile("log.txt", movieResult, (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
              });
        } else {
            console.log('Error occurred.');
        }
    });
};



function readLog() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if(error) {
            return console.log('ERROR: Reading random.txt \n\n' + error);
        }
        var dataArray = data.split(",");
        UserInput(dataArray[0], dataArray[1]);
    });
};




