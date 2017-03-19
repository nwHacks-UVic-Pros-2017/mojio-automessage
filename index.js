"use strict";

var express = require('express');
var MojioUser = require('./lib/MojioUser.js');
var http = require('http');
var https = require('https');
var fs = require('fs');

var app = express();
var mojio = new MojioUser();

app.get('/', function(req, res) {
    mojio.authorize('aj.podeziel@gmail.com', 'ZTxNPJvx7@vGw0', function(success) {
    	if (success) {
    		console.log("Authenticated");
    	} else {
			console.log("NOT Authenticated");
    	}
    });
    res.send("I'm an app!!!!!!!!!!!");
});

app.get('/signIn', function(req, res) {
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
	var vehicleId = req.query.vehicleId;

	var base_url = req.protocol + '://' + req.get('host');
	mojio.setup_ignition_event(vehicleId, base_url, function(key) {
		res.send(key);
		if (key) {
			mojio.get_address(vehicleId, function(location) {
				if (location) {
					console.log(location);
				} else {
					console.log("error getting location");
				}
			});
			//function to test if lat and lng are workAddress
			//if so, use sms
		} else {
			//error
		}
	});


	app.post('/' + vehicleId + '/ignition_on', function(req, res) {
		console.log("Car turned on");
	    console.log(req);
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

app.listen(80, function() {
    console.log("Listening on port 80");
});