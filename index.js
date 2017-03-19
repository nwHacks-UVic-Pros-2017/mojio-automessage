"use strict";

var express = require('express');
var MojioUser = require('./lib/MojioUser.js');
var http = require('http');
var https = require('https');
var fs = require('fs');

var app = express();
var mojio = new MojioUser();

var sslOptions = {
   key: fs.readFileSync('key.pem'),
   cert: fs.readFileSync('cert.pem'),
   passphrase: 'password'
};

https.createServer(sslOptions, app).listen(8080, function() {
	console.log("Listening on 8080");
});

app.get('/', function(req, res) {
    mojio.authorize('aj.podeziel@gmail.com', 'ZTxNPJvx7@vGw0', function(success) {
    	if (success) {
    		console.log("Authenticated");
    		mojio.suscribe_all_user_vehicles(function(success) {
		    	if (success) {
		    		console.log("Success registering vehicles");
		    	} else {
			    	console.log("Error with vehicles");
			        console.log(err);
		    	}
    		});
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

app.post('/:vehicle_id/ignition_on', function(req, res) {
	console.log("Car turned on");
    console.log(req);
});