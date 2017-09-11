//Initiliase varaibles for server use
const express = require('express');
const app = express();
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var router = express.Router();
var startTime = 0;

//initialise board
var five = require('johnny-five');
var board = new five.Board();

//Initialise database connection
admin.initializeApp({
  databaseURL: "https://project1-1d4a2.firebaseio.com/",
  credential: admin.credential.cert(serviceAccount)
});

//initialise database variables
var db = admin.database();
var alldata = db.ref("serverData2");
var sMotion = db.ref("serverData3").child("shortMotion");
var lMotion = db.ref("serverData3").child("longMotion");
var timeData = db.ref("serverData2").child("timeStamp");

//allow errors to be printed to console
alldata.on("value", function(snapshot) {
	console.log()
	}, function(errorObject){
	console.log("Failed" + errorObject.code)
});


//get board ready, and observing
board.on("ready", function(){
	var pin = 7;
	var motion = new five.Motion(pin);

  // "calibrated" occurs once, at the beginning of a session,
  motion.on("calibrated", function() {
    console.log("calibrated");
  });

	//initialise start time
	motion.on("motionstart", function() {
		startDate = new Date();
		startTime = startDate.getTime();
		console.log("Motion has started at: " + startTime)
	});

	//initialise end time
	motion.on("motionend", function() {
		endDate = new Date();
		endTime = endDate.getTime();
		console.log("Motion has ended at: " + endTime);
		alldata.update({startTime})
		alldata.update({endTime})
		console.log("Time difference is: " + (endTime-startTime));
		alldata.update({timeStamp:endTime-startTime})
		//Checks for long vs short motion and updated accordingly
		if((endTime-startTime > 5000)) {
		console.log("A long motion has been detected.");
		lMotion.transaction(function(longMotion){
			return(longMotion || 0) + 1
		});
		}
		else if((endTime-startTime < 5000)&&(endTime-startTime > 0)) {
		console.log("A short motion has been detected.");
			sMotion.transaction(function(shortMotion){
				return(shortMotion || 0) + 1
			});
		};
	});
	
});
