require("dotenv").config();

    // node module imports needed to run functions
    var fs = require("fs"); // read and write files
    var request = require("request");
    var keys = require("./keys.js");
    var twitter = require("twitter");
    var spotify = require("node-spotify-api");

    var input1 = process.argv[2];
    var input2 = process.argv[3];

    var spotify = new spotify(keys.spotify);
    var client = new twitter(keys.twitter);


    //LIRI commands
    switch(input1) {
        case "my-tweets": 
            myTweets(); 
            break;
        case "spotify-this-song": spotifyThisSong(input2); break;
        case "movie-this": movieThis(input2); break;
        case "do-what-it-says": doWhatItSays();
    }

    function myTweets() {
        var params = {
            screen_name: 'jsahagun91',
            count: 5
        }
        client.get('statuses/user_timeline',params, function(error,tweets,response){
            if(!error){
                for(i=0; i<tweets.length; i++){
                    console.log(tweets[i].text);
                }
            }
        })
  }

    function spotifyThisSong(song) {
        spotify.search({type: 'track', query:song}, function(err,data){
            if(err){
                return console.log("error: " + err)
            }
            console.log("Artist: " + data.tracks.items[0].album.artists[0].name)
            console.log("Title: " + data.tracks.items[0].name)
            console.log("Preview: " + data.tracks.items[0].href)
            console.log("Album: "  + data.tracks.items[0].album.name)
        })
        

    }


    function movieThis(movie){
        var myRequest = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"
        request(myRequest, function(error, response, body) {
     
      // If the request is successful (i.e. if the response status code is 200)
      if (!error && response.statusCode === 200) {
     
        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn’t obvious. Just spend a few moments dissecting it).
        console.log('Title: ',JSON.parse(body).Title)
        console.log('Year: ',JSON.parse(body).Year)
        console.log('Rotten Tomatoes rating is: ' + JSON.parse(body).Ratings[1].Value)
        console.log('Country: ',JSON.parse(body).Country)
        console.log('Language: ',JSON.parse(body).Language)
        console.log('Plot: ',JSON.parse(body).Plot)
        console.log('Actors: ',JSON.parse(body).Actors)
      }
     })
     }

     function doWhatItSays(){
        var commandMe = "spotify-this-song"
        var whatIWant = "Maps"
        var split = 0
        fs.readFile('random.txt','utf8', function(err, fileContents){
            if(err){
                console.log(err)
            }
            for(i=0;i<fileContents.length;i++){
                if(fileContents[i] === ","){
                    split = i+2
                    // console.log(fileContents[i])
                }
            }
            commandMe = fileContents.slice(0,split-2)
            whatIWant = fileContents.slice(split,fileContents.length-1)
            // console.log("command:",commandMe)
            // console.log("what I want:",whatIWant)
            switch (commandMe){
                case "spotify-this-song":
                    spotifyThisSong(whatIWant)
                    break
                case "movie-this":
                    movieThis(whatIWant)
                }
                // console.log(fileContents)
        })
     }