const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendEmail = functions.database.ref('serverData2/timeStamp')
  .onWrite(event =>{
    const time = event.data.val()
    if(time > 5000){
      console.log("LONG MOTION")
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
        subject: 'Long motion detected: firebase',
        text: 'Dear user,' + "\n" + "\n" + 'A long motion was detected by firebase.' + "\n" + "\n" + "Regards, " + "\n" + "Management team."
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log("An email to notify a long motion was detected, has been sent.")
    }
  })
exports.sendEmailMotionChange = functions.database.ref('serverData2/timeStamp')
  .onWrite(event =>{
    const time = event.data.val()
    return event.data.ref.parent.parent.once("value").then(snap => {
      const post = snap.val()
      const long = post.serverData3.longMotion
      const short = post.serverData3.shortMotion
        console.log("A change in motion was detected.")
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
          subject: 'Motion change detected: firebase',
          text:'Dear user,' + "\n" + "\n" + 'A change in motion was detected by firebase. Here are the changes: ' + "\n" + "\n" + 'Number of long motions are: ' + long + "\n" + "Number of short motions are: " + short + "\n" + "\n" + "Regards, " + "\n" + "Management team."
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        console.log("An email to notify a change in motion was detected, has been sent.")
    })
  })