/**
 * Created by ajdeziel on 2017-03-18.
 */

class TwilioSMSHandler {

    constructor(accountSid, authToken) {
        // Twilio Credentials
        this.accountSid = 'ACc064797f95f630c3fae396d5b7c813bc';
        this.authToken = '1a83966df89b604012003c48ff7bae07';

        //require the Twilio module and create a REST client
        var client = new require('twilio')(accountSid, authToken);
    }


    sendText(to, from, body) {
        client.messages.create({
            to: '+17784004137',
            from: '+12505084990',
            body: '<BodyText>',
        }, function (err, message) {
            console.log(message.sid);
        });
    }
}