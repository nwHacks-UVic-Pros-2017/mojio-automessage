"use strict";

var config = require('../config.js');
var MojioClientLite = require('mojio-client-lite');

/**
 * MojioUser: interface for interacting with the Mojio API. Retains OAuth credentials
 * for a user.
 *
 * Created by charlie on 2017-03-18.
 */
class MojioUser {

    constructor() {

        this.auth_state = false;

        var moj_config = {
            application : config.MOJIO_API_KEY,
            secret: config.MOJIO_SECRET_KEY
        };

        this._mojio_client = new MojioClientLite(moj_config);

    }

    authorize(email, password, cb) {

        var user = this;
        this._mojio_client.authorize(email, password).then(function(res, err) {

            if (err !== undefined) {
                user.auth_state = false;
                cb(false);
            }
            else {
                user.auth_state = true;
                cb(true);
            }

        });

    }

}

module.exports = MojioUser;