"use strict";

var express = require('express');
var MojioUser = require('./lib/MojioUser.js');
var http = require('http');
var https = require('https');
var fs = require('fs');
var GoogleHandler = require('./GoogleHandler.js');
var TwilioSMSHandler = require('./TwilioSMSHandler.js');
var session = require('express-session');
var path = require('path');

var app = express();
var mojio = new MojioUser();
var google = new GoogleHandler();
var twilio = new TwilioSMSHandler();

// session middleware (for tracking Mojio logins)
var sess = {
    "secret": "fdsf53t44rfef23",
    "cookie": {"maxAge": 360000}
};
app.use(session(sess));

// check if session is authorized, if not redirect to login screen
app.use(function(req, res, next) {
    if (!req.session.mojio_client || !req.session.mojio_client.auth_state) {
        res.sendFile(path.join(__dirname, "static"), "login.html");
    }
    else {
        next();
    }
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "static"), 'index.html');
});

app.post('/signIn', function(req, res) {
	mojio.authorize(req.query.userName, req.query.password, function(success) {
    	if (success) {
    		console.log("Authenticated with user " + req.query.userName);
    		res.send("{ status: \"success\"}");
    	} else {
			console.log("NOT Authenticated");
			res.send("{ status: \"failed\"}");
    	}
    });
});

app.get('/getVehicles', function(req, res) {
	console.log("/getVehicles");
	mojio.get_user_vechiles(function (vehicles) {
		if (vehicles) {
			console.log("Sending vehicles");
			console.log(vehicles);
			res.send(vehicles);
		} else {
			console.log("Error sending vehicles");
		}
	});
});

app.get('/setupLeaveWorkAlerts', function(req, res) {
	console.log('/setupLeaveWorkAlerts');
	var number = req.query.number;
	var fromName = req.query.fromName;
	var toName = req.query.toName;
	var workAddress = req.query.workAddress;
	var homeAddress = req.query.homeAddress;
	var vehicleId = req.query.vehicleId;

	var base_url = req.protocol + '://' + req.get('host');
	mojio.setup_ignition_event(vehicleId, base_url, function(key) {
		res.send(key);
		if (key) {
			//post setup success
		} else {
			//error
		}
	});

	app.post('/' + vehicleId + '/ignition_on', function(req, res) {
		console.log("Car turned on");
		console.log(req);
		mojio.get_address(vehicleId, function(location) {
				if (location) {
					console.log(location);
				} else {
					console.log("error getting location");
				}
				if (google.is_work_address(workAddress, location.Lat, location.Lng)) {
					var duration = google.estimate_time_home(workAddress, homeAddress);
					var msg = twilio.formatMessage(workAddress, homeAddress, duration);
					twilio.sendText(phone, msg);
				}
			});
		//Send txt code here
	});
});

app.get('/getAddress', function(req, res) {
	console.log('/getAddress');
	var vehicleId = req.query.vehicleId;
	mojio.get_address(vehicleId, function(location) {
		if (location) {
			console.log(location);
			res.send(location);
		} else {
			console.log("error getting location");
		}
	});
});

app.get('/removeLeaveWorkAlerts', function(req, res) {
	var key = req.query.key;
	mojio.delete_observer(key, function(success) {
		if (success) {
    		console.log("Removed leave work alerts");
    		res.send("{ status: \"success\"}");
    	} else {
			res.send("{ status: \"failed\"}");
    	}
	});
});

app.listen(5030, function() {
    console.log("Listening on port 5030");
});
