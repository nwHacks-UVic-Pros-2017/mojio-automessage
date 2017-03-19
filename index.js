"use strict";

var express = require('express');
var MojioUser = require('./lib/MojioUser.js');
var app = express();

app.get('/', function(req, res) {
	var mojio = new MojioUser();
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

app.post('/:vehicle_id/ignition_on', function(req, res) {
	console.log("Car turned on");
    console.log(req);
});

app.listen(8080, function() {
    console.log("Listening on port 8080.");
});