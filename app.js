//Initiliase varaibles for server use
const express = require('express');
const app = express();
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var http = require('http').Server(app);
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


//allow errors to be printed to console
alldata.on("value", function(snapshot) {
	console.log(snapshot.val())
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
		console.log("Motion has started at" + startTime)
		alldata.update({startTime})
	});

	//initialise end time
	motion.on("motionend", function() {
		endDate = new Date();
		endTime = endDate.getTime();
		console.log("Motion has ended at" + endTime);
		alldata.update({endTime})
		alldata.update({timeStamp:endTime})
	});
});

router.use(function(req, res, next){
	next()
});

router.get("/", function(req, res){
	res.sendFile("index.html", {root: __dirname});
});


app.use("/", router)

http.listen(8080, function(){
	console.log("Live at port 8080")
});


