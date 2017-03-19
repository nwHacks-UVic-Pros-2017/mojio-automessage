"use strict";
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class GoogleHandler {

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY;
		this.url = "https://maps.googleapis.com/maps/api/directions/xml?"
		this.distance_threadhold = 500; //meters
	}

	build_request_url(orgin, dest, apiKey) {
		return this.url + "origin="  + orgin + "&destination=" + dest + "&key=" + this.apiKey + "&units=imperial";
	}

	estimate_time_home(workAddress, homeAddress) {
		var request = this.build_request_url(workAddress, homeAddress, this.apiKey);
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open( "GET", request, false ); // false for synchronous request
    	xmlhttp.send( null );
    	console.log(xmlhttp.responseText);
    	return xmlhttp.responseText.rows[0].elements[0].duration.text;
	}

	is_work_address(workAddress, lat, lng) {
		var request = this.build_request_url(workAddress, lat + "," + lng, this.apiKey);
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open( "GET", request, false ); // false for synchronous request
    	xmlhttp.send( null );
    	console.log(xmlhttp.responseText);
    	var is_within_distance = xmlhttp.responseText.rows[0].elements[0].distance.value <= this.distance_threadhold;
    	return is_within_distance;
	}
}

module.exports = GoogleHandler;