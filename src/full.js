/* eslint no-console: 0 */

'use strict';

const nodemailer = require('../lib/nodemailer');
var express = require('express');
var app = express();
var bodyParser = require('body-parser'),path = require("path");
//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Generate SMTP service account from ethereal.email
nodemailer.createTestAccount((err, account) => {
	console.log(account.user);
	console.log(account.pass);
	console.log(account.smtp.host);
	console.log(account.smtp.port);
	console.log('sec',account.smtp.secure);
	
    if (err) {
        console.error('Failed to create a testing account');
        console.error(err);
        return process.exit(1);
    }

    console.log('Credentials obtained');

    // NB! Store the account object values somewhere if you want
    // to re-use the same account for future mail deliveries

    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport(
        {
            host: 'smtp.gmail.com',
            port: '587',
            secure: false,
            auth: {
                user: 'sjgen14@gmail.com',
                pass: 'yojgen10'
            },
            logger: false,
            debug: false // include SMTP traffic in the logs
        },
        {
            // default message fields

            // sender info
            from: 'no-reply<no-reply@shift.online>',
            headers: {
                'X-Laziness-level': 1000 // just an example header, no need to use this
            }
        }
    );
	/*end nodemailer settup*/
   
   
   
    //tell express that www is the root of our public web folder
app.use(express.static(path.join(__dirname, 'nodemailer')));

//tell express what to do when the /about route is requested
app.post('/form', function(req, res){
    res.setHeader('Content-Type', 'application/json');
	 console.log(req.body.lastname);
    //mimic a slow network connection
    setTimeout(function(){

        res.send(JSON.stringify({
            firstName: req.body.firstname || null,
            lastName: req.body.lastname || null
        }));

    }, 1000)

    //debugging output for the terminal
    console.log('you posted: First Name: ' + req.body.firstName + ', Last Name: ' + req.body.lastName);
});

    app.post("/voice-mail", function (req, res) {
  		//app.push(request.query);
  		var response=0;
  		console.log('sending message...');
  		res.setHeader('Content-Type', 'application/json');
  		 // Message object
  		 console.log(req);
    	let message = {
        // Comma separated list of recipients
        to: '<'+req.body.emailto+'>',

        // Subject of the message
        subject: req.body.subject || null +'✔',

        // plaintext body
        text: req.body.text || null,

        // HTML body
        html:
            '<p><b>Hello Good Day,</b><br></p>' +
            'An error occured in voice,<br>'+
            'reported by:'+req.body.reportedby || null,

        // An array of attachments
        /*attachments: [
            // String attachment
            {
                filename: 'notes.txt',
                content: 'Some notes about this e-mail',
                contentType: 'text/plain' // optional, would be detected from the filename
            },

            // Binary Buffer attachment
            {
                filename: 'image.png',
                content: Buffer.from(
                    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                        '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                        'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
                    'base64'
                ),

                cid: 'note@example.com' // should be as unique as possible
            },

            // File Stream attachment
            {
                filename: 'jd  ✔.gif',
                path: __dirname + '/assets/jd.gif',
                cid: 'jd@example.com' // should be as unique as possible
            }
        ]*/
    };

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            //return process.exit(1);
            process.exit(1);

  				console.log('fail');
  	 			res.sendStatus(400);
        }
			
        console.log('Message sent successfully!');
        console.log(nodemailer.getTestMessageUrl(info));
		  
        // only needed when using pooled connections
        transporter.close();
        console.log('success');
  		  res.sendStatus(200);
    });

	});

	app.get('/', (req, res) => {
		res.send('connected!');
	});
    var listener = app.listen(3001, function () {
  		console.log('Your app is listening on port ' + listener.address().port);
	 });
});
