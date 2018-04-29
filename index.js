/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = "amzn1.ask.skill.f42bacec-da9a-4c72-af5b-0d1ccc5e36b9";

var myBucket = 'alexawebbuilderhost';      // replace with your own bucket name!
var myObject = 'index.html';          // replace with your own file name!

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        this.response.speak("Welcome to the Web Builder");
        this.emit(':responseReady');
        //this.emit('helloIntent');
    },

     "ConnectToOkta": function handleConnectToOkta() {
        console.log(JSON.stringify(this.event.request));
        
        if (this.event.session.user.accessToken === undefined) {
            this.emit(":tellWithLinkAccountCard",
                "Please use the Alexa mobile companion app to link you're Okta account");
        } else {
            this.emit(":tell", "You are already connected.");
        }
    },
    
    'TitleIntent': function () { 
         if (this.event.session.user.accessToken === undefined) {
            this.emit(":tellWithLinkAccountCard",
            "Please use the Alexa mobile companion app to link you're Okta account");
        } else {
            // delegate to Alexa to collect all the required slots 
            let isTestingWithSimulator = false; //autofill slots when using simulator, dialog management is only supported with a device 
            let filledSlots = delegateSlotCollection.call(this, isTestingWithSimulator); 

            if (!filledSlots) { 
                return; 
            } 

            console.log("filled slots: " + JSON.stringify(filledSlots)); 
            // at this point, we know that all required slots are filled. 
            let slotValues = getSlotValues(filledSlots); 

            console.log(JSON.stringify(slotValues)); 


            let speechOutput = 'You have filled 4 required slots. ' + 
            'content resolved to,  ' + slotValues.content.resolved + '. ' + 
            'font resolved to,  ' + slotValues.font.resolved + '. ' + 
            'size resolved to,  ' + slotValues.size.resolved + '. ' + 
            'color resolved to,  ' + slotValues.color.resolved + '. ' ; 

            //this.response.speak("I love cookies");
            //this.emit(':responseReady');
          
            // Calls to S3 here
                var myParams = {
                    Bucket: myBucket,
                    Key: myObject,
                    Data: ''
                };
                
                //Check if file exists
                var AWS = require('aws-sdk');
                var s3 = new AWS.S3();

                s3.getObject(params, function(err, data) {

                     if (err) {
                        console.log(err, err.stack);
                        // file does not exist, make file

                        s3.putObject(params, function(err, data) {
                          if (err) console.log(err, err.stack); // an error occurred
                          else     console.log(data);           // successful response
                        });
                     } else {
                        console.log(data);
                        //file exist, do something
                     } 
                });
                S3read(myParams,  myResult => {
                    console.log("sent     : " + JSON.stringify(myParams));
                    console.log("received : " + myResult);
            
                    this.response.speak('The S 3 file says, ' + myResult );
                    this.emit(':responseReady');
                });
                    
                S3write(myParams,  myResult => {
                    console.log("sent     : " + JSON.stringify(myParams));
                    console.log("received : " + JSON.stringify(myResult));
                    
                    var fs = require('fs');
                        
                    //fs.appendFile('index.html', '<p>Hello</p>', function (err) {
                     //   if (err) throw err;
                    //    console.log('Updated!');
                  //  });
                    
                    this.response.speak('The S 3 file was successfully written. ETag: ' + myResult );                  
                    this.emit(':responseReady');
                });  
                
                
                // Load the AWS SDK for Node.js
                var AWS = require('aws-sdk');
                
                console.log("Load AWS SDK Node.js succesful");

                // Create S3 service object
                var s3 = new AWS.S3();
                
                console.log("Make s3 object");

                // call S3 to retrieve upload file to specified bucket
                var uploadParams = {Bucket: process.argv[2], Key: '', Body: ''};
                var file = process.argv[3];
                console.log("File is: ",file);
                var fs = require('fs');
                var fileStream = fs.createReadStream(file);
                fileStream.on('error', function(err) {
                  console.log('File Error', err);
                });
                uploadParams.Body = fileStream;
                
                var path = require('path');
                uploadParams.Key = path.basename(file);
                console.log("Upload Param key: ", uploadParams.key)
                // call S3 to retrieve upload file to specified bucket
                s3.upload (uploadParams, function (err, data) {
                  if (err) {
                    console.log("Error", err);

                  } if (data) {
                    console.log("Upload Success", data.Location);
                  }
                });
                
            console.log("Speech output: ", speechOutput); 
            this.response.speak(speechOutput); 
            this.emit(':responseReady'); 
        }
    },

    'MagpieIntent' : function() {
         this.response.speak("A wild Magpie has been encountered");
         //this.emit(':responseReady');
        
        var S = require('string');
        var fs = require('fs');

       // var bigString = "I am a very crazy bird";
       // var smallString = "was";
        var bigString = "<html> <head> Title </head> <body> <h1> Hello World </h1> </body> </html>";
        var smallString = "<p> Sai Guy </p>";
        var injection = "<body> " + smallString;

        var bodyStart = bigString.indexOf('<body>');
        var bodyEnd = bodyStart + 6; // Very very limited case!

        var result = bigString.substr(0,bodyStart) + injection + bigString.substr(bodyEnd,bigString.length - bodyEnd);

        fs.writeFile('/tmp/the_inconspicuous_file.html', result, function (err) {
        	if (err) throw err;
        	console.log("Quite insconpicuous");
        	//this.response.speak("Ethan is very fat. Tug tug tug");
      	   // this.emit(':responseReady');
        });

        //var ethan = bigString.substr(5,6);
        //var howOldIsEthan = ethan.indexOf('very');

        //S(bigString).replaceAll("am", smallString).s;
        
        //bigString = bigString.replace("am", smallString);
        
      //  this.response.speak(result);
        this.response.speak("Ethan is very fat. Tug tug tug");
        this.emit(':responseReady');
        
        
    },

    'GetNewFactIntent': function () {
        const factArr = data;
        const factIndex = Math.floor(Math.random() * factArr.length);
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;

        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};
function S3read(params, callback) {
    // call AWS S3
    console.log("Calling S 3 READ");
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3();

    s3.getObject(params, function(err, data) {
        if(err) { console.log(err, err.stack); }
        else {
            console.log("Read file");
            var fileText = data.Body.toString();  // this is the complete file contents

            callback(fileText);
        }
    });
};

function S3write(params, callback) {
    // call AWS S3
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3();

    s3.putObject(params, function(err, data) {
        if(err) { console.log(err, err.stack); }
        else {
            callback(data["ETag"]);
        }
    });
};

// used to emit :delegate to elicit or confirm Intent Slots
function delegateSlotCollection(){
    console.log("current dialogState: " + this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
        var updatedIntent = this.event.request.intent;
        if (! updatedIntent.slots.color.value) {
            //Default Values are set here
            updatedIntent.slots.color.value = 'Black';
        }

        this.emit(":delegate", updatedIntent);

    } else if (this.event.request.dialogState !== "COMPLETED") {

        this.emit(":delegate");

    } else {
        console.log("returning: "+ JSON.stringify(this.event.request.intent));

        return this.event.request.intent.slots;
    }
}

function getSlotValues (filledSlots) { 
    //given event.request.intent.slots, a slots values object so you have 
    //what synonym the person said - .synonym 
    //what that resolved to - .resolved 
    //and if it's a word that is in your slot values - .isValidated 
    let slotValues = {}; 
 
    console.log('The filled slots: ' + JSON.stringify(filledSlots)); 
    Object.keys(filledSlots).forEach(function(item) { 
        //console.log("item in filledSlots: "+JSON.stringify(filledSlots[item])); 
        var name = filledSlots[item].name; 
        //console.log("name: "+name); 
        if(filledSlots[item]&& 
            filledSlots[item].resolutions && 
            filledSlots[item].resolutions.resolutionsPerAuthority[0] && 
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status && 
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code ) { 
 
            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) { 
                case "ER_SUCCESS_MATCH": 
                    slotValues[name] = { 
                        "synonym": filledSlots[item].value, 
                        "resolved": filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name, 
                        "isValidated": true 
                    }; 
                    break; 
                case "ER_SUCCESS_NO_MATCH": 
                    slotValues[name] = { 
                        "synonym": filledSlots[item].value, 
                        "resolved": filledSlots[item].value, 
                        "isValidated":false 
                    }; 
                    break; 
            } 
        } else { 
            slotValues[name] = { 
                "synonym": filledSlots[item].value, 
                "resolved": filledSlots[item].value, 
                "isValidated": false 
            }; 
        } 
    },this); 
    //console.log("slot values: "+JSON.stringify(slotValues)); 
    return slotValues; 
} 

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};