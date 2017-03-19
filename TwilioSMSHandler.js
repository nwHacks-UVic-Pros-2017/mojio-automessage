"use strict";
/**
 * Created by ajdeziel on 2017-03-18.
 */

class TwilioSMSHandler {

    constructor() {
        // Twilio Credentials
        this.accountSid = 'ACc064797f95f630c3fae396d5b7c813bc';
        this.authToken = '1a83966df89b604012003c48ff7bae07';

        //require the Twilio module and create a REST client
        var client = new require('twilio')(this.accountSid, this.authToken);
    }


    sendText(to, body) {
        client.messages.create({
            to:  to,
            from: '+17784004137',
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