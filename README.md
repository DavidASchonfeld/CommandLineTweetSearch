# Tweet Collector

### IMPORTANT NOTE: In order to use this tool, you must have: 
<br />--"key" and "secret" values from your own Twitter Developer Account. Create an app inside your account to get specific values for your copy of getTweets.js
<br />--Node.js and the node package "request" installed.
<br />
 
### My Decisions

When the user does not specify a certain username on the command line, the program will print a usage statement instead of using a default username. 
 
If a user specifies a username but not a value for the amount of tweets to fetch, the program will fetch 5 tweets. Because of this, an error will not be thrown when the command line value representing this value is undefined. 
 
The Twitter API's GET endpoint I am using is only able to return up to 200 tweets at a time. I have decided to mention this limit in the usage statement of my program. 
 
The usage statement is only printed when the user does not use the correct format. If the user merely uses an invalid value for the number of tweets to be fetched, the program only prints out a reason stating why the number they submitted is incorrect. 
 
To ensure that this tool works every time it is called, a new bearer token will be obtained and used every time this tool is called. 
 
If no tweets are found for a certain user, this tool will state an appropriate message. 
 
I have also decided to include error messages. 
 
 
 
 
### Usage Details
<br />Usage:
<br />```node getTweets.js @username {Number of Tweets to Obtain}");```
<br />Example:
<br />```node getTweets.js @github 10```
<br />Notes Regarding "Number of Tweets to Obtain":
<br />  If left blank, the number 5 will be used.
<br />  A maximum of 200 tweets can be obtained each time this command is called. 

