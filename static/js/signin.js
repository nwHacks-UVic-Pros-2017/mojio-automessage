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
        var status = JSON.parse(data).status;
        if (status === "success") {
            window.location.href = "/";
        }
        else {
            alert("Invalid username/password. You made Ben cry.");
        }
    });

});

$(document).ready(function() {
    console.log("Starting login...");
});