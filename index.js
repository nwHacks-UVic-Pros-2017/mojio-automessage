"use strict";

var express = require('express');
var MojioUser = require('./lib/MojioUser.js');
var fs = require('fs');
var GoogleHandler = require('./GoogleHandler.js');
var TwilioSMSHandler = require('./TwilioSMSHandler.js');
var session = require('express-session');
var path = require('path');

var app = express();
var mojio = new MojioUser();
var google = new GoogleHandler();
var twilio = new TwilioSMSHandler();


var port = process.env.PORT || 8080;

app.listen(port, function() {
    console.log("Listening on port " + port);
});

app.use('/static', express.static(path.join(__dirname, "static")));

// session middleware (for tracking Mojio logins)
var sess = {
    "secret": process.env.SESSION_COOKIE_SECRET,
    "cookie": {"maxAge": 360000}
};
app.use(session(sess));

// check if session is authorized, if not redirect to login screen
function isAuthenticated(req, res, next) {
    if (req.session.mojio_client && req.session.mojio_client.auth_state) {
        return next();
    }

    res.redirect('/signIn');
}

app.get('/', isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.get("/signIn", function(req, res) {
    res.sendFile(path.join(__dirname, "static", "login.html"));
});

app.get('/login', function(req, res) {
	mojio.authorize(req.query.userName, req.query.password, function(success) {
    	if (success) {
    		console.log("Authenticated with user " + req.query.userName);
    		res.send("{ \"status\": \"success\"}");
    	} else {
			console.log("NOT Authenticated");
			res.send("{ \"status\": \"failed\"}");
    	}
    });
});

app.get('/getVehicles', isAuthenticated, function(req, res) {
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

	var base_url = 'https://' + req.get('host');
	console.log(base_url);
	mojio.setup_ignition_event(vehicleId, base_url, function(key) {
		if (key) {
			console.log("Mojio sucessfully posting on ignition-on");
		} else {
			console.log("Mojio failure posting on ignition-on");
		}
	});

	twilio.registerNumber(number, function(verification_code) {
		console.log(verification_code);
		res.send({"code" : verification_code });
	});

	app.post('/' + vehicleId + '/ignition_on', function(req, res) {
		console.log("Car turned on");
		mojio.get_address(vehicleId, function(location) {
				if (location) {
					console.log("Mojio sucessfully recieved car's location");
				} else {
					console.log("Mojio failed getting car's location");
				}
				if (google.is_work_address(workAddress, location.Lat, location.Lng)) {
					console.log("Car is near work address");
					var duration = google.estimate_time_home(workAddress, homeAddress);
					var msg = twilio.formatMessage(fromName, toName, duration);
					console.log(msg);
					twilio.sendText(number, msg);
				} else {
					console.log("Car is not near work address");
				}
			});
		//Send txt code here
	});
});

app.get('/getAddress', isAuthenticated, function(req, res) {
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

app.get('/removeLeaveWorkAlerts', isAuthenticated, function(req, res) {
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
