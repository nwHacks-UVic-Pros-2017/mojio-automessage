"use strict";

class GoogleHandler {

	constructor() {
		this.apiKey = process.env.GOOGLE_API_KEY;
		this.url = "https://maps.googleapis.com/maps/api/directions/xml?"
		this.distance_threadhold = 500; //meters
	}

	estimate_time_home(workAddress, homeAddress) {
		var request = build_request_url(workAddress, homeAddress, this.apiKey);
		var xhttp = new XMLHttpRequest();
		xmlhttp.open( "GET", request, false ); // false for synchronous request
    	xmlhttp.send( null );
    	return xmlHttp.responseText.rows[0].elements[0].duration.text;
	}

	is_work_address(workAddress, lat, lng) {
		var request = build_request_url(workAddress, lat + "," + lng, this.apiKey);
		var xhttp = new XMLHttpRequest();
		xmlhttp.open( "GET", request, false ); // false for synchronous request
    	xmlhttp.send( null );
    	var is_within_distance = xmlHttp.responseText.rows[0].elements[0].distance.value <= this.distance_threadhold;
    	return is_within_distance;
	}

	build_request_url(orgin, dest, apiKey) {
		return this.url + "orgin="  + orgin + "&destination=" + dest + "&key=" + this.apiKey + "&units=imperial";
	}
}

module.exports = GoogleHandler;