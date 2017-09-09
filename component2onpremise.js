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
var timedata = db.ref("serverData2").child("timeStamp");
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
	//now check to see whether value was short or long motion, using milliseconds
	if(data > 5000) {
		console.log("A long motion has been detected.");
		sendEmailLong();
	};
	else if((data < 5000)&&(motionTime > 0)) {
		console.log("A short motion has been detected.");

	};
});
function sendEmailLong(){
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fit3140.team2424@gmail.com',
        pass: 'WatchedPotsNeverBoil'
      }
    });
    var mailOptions = {
      from: 'fit3140.team2424@gmail.com',
      to: 'fit3140.team2424@gmail.com',
      subject: 'Sending Email using Node.',
      text: 'Sending email because we have detected a long motion!'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    console.log("EMAIL FOR LONG SENT")
}






http.listen(8080, function(){
	console.log("Live at port 8080")
});
