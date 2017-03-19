"use strict";
/**
 * Created by ajdeziel on 2017-03-18.
 */

class TwilioSMSHandler {

    constructor() {
        // Twilio Credentials
        this.accountSid = process.env.TWILIO_SID;
        this.authToken = process.env.TWILIO_TOKEN;
        //require the Twilio module and create a REST client
        var client = new require('twilio')(this.accountSid, this.authToken);
    }


    sendText(to, body) {
        client.messages.create({
            to:  to,
            from: process.env.TWILIO_NUMBER,
            body: body,
        }, function (err, message) {
            console.log(message.sid);
        });
    }

    formatMessage(fromName, toName, duration_text) {
        return "Hello " + toName + ". " + fromName + " is leaving work and will be home in " + duration_text;
    }
}

module.exports = TwilioSMSHandler;