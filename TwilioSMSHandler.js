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
        this.client = new require('twilio')(this.accountSid, this.authToken);
    }

    registerNumber(phone, callback) {
        this.client.outgoingCallerIds.create({
            phoneNumber: phone
        }, function(err, callerId) {
            if (err==null) {
                callback(callerId.validation_code);
            } else {
                callback(null);
            }
        });
    }

    sendText(to, body) {
        this.client.messages.create({
            to:  to,
            from: process.env.TWILIO_NUMBER,
            body: body,
        }, function (err, message) {
            console.log(message);
            console.log(err);
        });
    }

    formatMessage(fromName, toName, duration_text) {
        return "Hello " + toName + ". " + fromName + " is leaving work and will be home in " + duration_text;
    }
}

module.exports = TwilioSMSHandler;