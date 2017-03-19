/**
 * Client-side login logic.
 * Depends on JQuery 3.2.0.
 *
 * Created by charlie on 2017-03-19.
 */

$("#form-signin").submit(function() {
    console.log("Form submitted!");

    var email = $("#inputEmail").value;
    var password = $("#inputPassword").value;

    $.post("/signIn", {
        "userName": email,
        "password": password
    }, function(data) {
        console.log(data);
    }).fail(function(data) {
        console.log(data);
    });

});
$(document).ready(function() {
    console.log("Starting login...");
});