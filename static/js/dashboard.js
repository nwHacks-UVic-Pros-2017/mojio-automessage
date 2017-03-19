/**
 * Client-side functionality for Ben dashboard.
 * Depends on JQuery 3.2.0
 *
 * Created by charlie and AJ on 2017-03-19.
 */

function init() {

    // get vehicles
    $.get('/getVehicles', {}, function(data) {

        vehicles = data;

        var carsList = $("#cars-list");
        for (var i = 0; i < vehicles.length; i++) {
            var link = document.createElement("a");
            var listEle = document.createElement("ul");
            listEle.innerHTML = vehicles[i].Name;
            link.setAttribute('href', "#");
            link.append(listEle);
            carsList.append(link);
        }

        setCar(0);

    })

}

function initMap() {
    var myLatLng = {lat: 49.258838, lng: -123.056623};

    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        scrollwheel: false,
        zoom: 12
    });

    // Create a marker and set its position.
    marker = new google.maps.Marker({
        map: map,
        position: myLatLng,
        title: 'Hello World!'
    });
}

function setCar(carInd) {

    // set name
    $("#current-car-name").html(vehicles[carInd].Name);

    // TODO: update map

}

$(document).ready(function() {
    console.log("Starting dashboard...");
    init();
});