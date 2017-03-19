/**
 * Created by charlie on 2017-03-19.
 */

$("#login-submit").click(function(e) {
    console.log("Form submitted!");

    var email = $("#inputEmail").val();
    var password = $("#inputPassword").val();

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