/**
 * Created by charlie on 2017-03-19.
 */

$("#form-signin").submit(function(e) {
    e.preventDefault();
    console.log("Form submitted!");

    var email = $("#inputEmail").value;
    var password = $("#inputPassword").value;

    $.get("/login", {
        "userName": email,
        "password": password
    }, function(data) {
        console.log(data);
    });

});

$(document).ready(function() {
    console.log("Starting login...");
});