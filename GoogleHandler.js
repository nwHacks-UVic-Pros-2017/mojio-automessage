"use strict";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class GoogleHandler {

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY;
		this.url = "https://maps.googleapis.com/maps/api/distancematrix/json?"
		this.distance_threadhold = 1000; //meters
	}

	build_request_url(orgin, dest, apiKey) {
		return this.url + "origins="  + orgin + "&destinations=" + dest + "&key=" + this.apiKey + "&units=imperial";
	}

	estimate_time_home(workAddress, homeAddress) {
		var request = this.build_request_url(workAddress, homeAddress, this.apiKey);
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open( "GET", request, false ); // false for synchronous request
    	xmlhttp.send( null );
    	var res = JSON.parse(xmlhttp.responseText);
    	return res.rows[0].elements[0].duration.text;
	}

	is_work_address(workAddress, lat, lng) {
		var request = this.build_request_url(workAddress, lat + "," + lng, this.apiKey);
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open( "GET", request, false ); // false for synchronous request
    	xmlhttp.send( null );
    	var res = JSON.parse(xmlhttp.responseText);
    	console.log(res.rows[0].elements[0].distance.value);
    	var is_within_distance = res.rows[0].elements[0].distance.value <= this.distance_threadhold;
    	return is_within_distance;
	}
}

module.exports = GoogleHandler;