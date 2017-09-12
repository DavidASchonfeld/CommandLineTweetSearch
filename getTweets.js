
// Imports
var request = require('request');

// Variables
var key = ""; //You must get your own key from Twitter's developer website
var secret = ""; //You must get your own secret from Twitter's developer website
var baseUrl = "https://api.twitter.com/";

var token = "";

var targetUser;
var tweetCount = 5; //This is the default value that will be used if the user does not specify a value in the command line.


// Code That is Run When the Script Starts

// Process Command Line Values

// Command Line Values - Error Catching
if(!process.argv[2]){
  console.log("ERROR: Invalid format. You must specify a username.");
  printUsageStatement();
  return;
}
if (process.argv[2].charAt(0) != '@'){
  console.log("ERROR: Invalid format. You must include \'@\' before a username.");
  printUsageStatement();
  return;
}
if (process.argv[3]){ //If this command line value is not defined, the default value of tweetCount will be used. This is handled below.
  if (isNaN(process.argv[3])){
    console.log("ERROR: The value \""+process.argv[3]+"\" is not valid number. Please try again with a valid number.");
    return;
  }
  if (process.argv[3] <= 0){
    console.log("The number of tweets must be a positive number. Please try again with a valid number.");
    return;
  }
  if(process.argv[3]%1 != 0){
    console.log("The number of tweets must be a whole number. Please try again with a valid number.");
    return;
  }
  if (process.argv[3] > 200){
    console.log("ERROR: The number of tweets to obtain cannot exceed 200. Please try again using a number less than or equal to 200.");
    return;
  }
}

// Command Line Values - Processing Values
targetUser = process.argv[2].substring(1); //This line removes the "@" at the front of the username, making the username readable by the Twitter API.
if(process.argv[3]){
  tweetCount = process.argv[3];
}

//Start API Calls
obtainBearerToken(); //This function also calls the getTweets() function


// Function - Usage Statement

function printUsageStatement(){
  console.log("Usage:");
  console.log("  node getTweets.js @username {Number of Tweets to Obtain}");
  console.log("Example:");
  console.log("  node getTweets.js @gofooda 10");
  console.log("Notes Regarding \"Number of Tweets to Obtain\":");
  console.log("  If left blank, the number 5 will be used.");
  console.log("  A maximum of 200 tweets can be obtained each time this command is called.");
  return;
}

// Functions - API Functions

function obtainBearerToken(){
  var key_encoded = encodeURIComponent(key);
  var secret_encoded = encodeURIComponent(secret);
  var credentials = key_encoded+":"+secret_encoded;
  var credentials_encoded = String(new Buffer(credentials).toString('base64'));

  var requestSettings = {
    headers: {
      'Authorization' : 'Basic '+credentials_encoded,
      'Content-Type' :  'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: 'grant_type=client_credentials',
    method: 'POST',
    url: baseUrl + 'oauth2/token'
  };
  request(requestSettings, function(error, response, body){
      if (error || response.statusCode != 200){
        // API Request Error
        console.log("ERROR: Obtaining bearer token. API Error: "+response.statusCode);
        return;
      } else {
        var body_parsed = JSON.parse(response.body);
        if(body_parsed.token_type != 'bearer'){
          console.log("ERROR: Obtaining bearer token. Token received is not a \"bearer\" token.");
          return;
        }
        token = body_parsed.access_token;
        getTweets();
      }

  });
}

function getTweets(){

  var requestSettings = {
    headers: {
      'Authorization' : 'Bearer '+token,
      'Content-Type' :  'application/x-www-form-urlencoded;charset=UTF-8'
    },
    method: 'GET',
    url: baseUrl + '1.1/statuses/user_timeline.json'+"?screen_name="+targetUser+"&count="+tweetCount
  };
  request(requestSettings, function(error, response, body){
      if (error || response.statusCode != 200){
        // API Request Error
        if (response.statusCode==404){
          console.log("ERROR: The specifed username does not exist.");
        } else {
          console.log("ERROR: Obtaining tweets. API Error: "+response.statusCode);
        }
        return;

      } else {

        // Parses the incoming tweet information
        var body_parsed = JSON.parse(response.body);
        if (body_parsed.length == 0){
          console.log("No tweets could be found for "+targetUser+".");
          return;
        }

        // Prints out all of the tweets
        console.log("\n");
        body_parsed.forEach(function(tweetObject){
          console.log(tweetObject.text);
          console.log(" at "+tweetObject.created_at);
          console.log("\n");
        });
      }

  });
}
