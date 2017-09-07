//Initiliase varaibles for server use
const express = require('express');
const app = express();
const admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var http = require('http').Server(app);
var router = express.Router();
var startTime = 0;

//Initialise database connection
admin.initializeApp({
  databaseURL: "https://project1-1d4a2.firebaseio.com/",
  credential: admin.credential.cert(serviceAccount)
});

//initialise database variables
var db = admin.database();
var timedata = db.ref("serverData2");
var alldata = db.ref("serverData3");
var startingTime = db.ref("serverData2").child("startTime");
var endingTime = db.ref("serverData2").child("endTime");
var s = db.ref("serverData3").child("shortMotion");
var l = db.ref("serverData3").child("longMotion");

//allow errors to be printed to console
alldata.on("value", function(snapshot) {
	console.log(snapshot.val())
	}, function(errorObject){
	console.log("Failed" + errorObject.code)
});

timedata.on("value", function(snapshot) {
	data = snapshot.val();
	sTime = data.startTime
	eTime = data.endTime
	motionTime = eTime - sTime
	//now check to see whether value was short or long motion, using milliseconds
	if((motionTime > 5000)) {
		console.log("A long motion has been detected.");
		l.transaction(function(longMotion){
			return(longMotion || 0) + 1
		});
	}
	else if((motionTime < 5000)&&(motionTime > 0)) {
		console.log("A short motion has been detected.");
			s.transaction(function(shortMotion){
				return(shortMotion || 0) + 1
			});
	
	};
});
router.use(function(req, res, next){
	next()
});


app.use("/", router)

http.listen(8080, function(){
	console.log("Live at port 8080")
});
