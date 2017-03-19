"use strict";

var app = require('../index.js');
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

    suscribe_all_user_vehicles(callback) {
        var self = this;
        this._mojio_client.get().vehicles().then(function(res, err) {
            if (err == null) {
                var vehicle_ids = res.Data.map(function(vehicle) {
                    return vehicle.Id;
                });
                vehicle_ids.forEach(function(vehicle_id) {
                    self.suscribe_ignition(vehicle_id, "http://localhost:8080/", callback);
                });
            } else {
                callback(false);
            }
        });
    }

    suscribe_ignition(vehicle_id, base_url, callback) {
        var address = base_url  + vehicle_id + "/ignition_on";
        var data = {
            "Key": "ignition_on",
            "Conditions": "IgnitionState.Value eq true",
            "Timing": "Leading",
            "Transports": [
                {
                    "Type": "HttpPost",
                    "Address": address
                }
            ]
        };
        this._mojio_client.post("https://push.moj.io/v2/vehicle/" + vehicle_id, data).then(function(res,err){
            if (err == null) {
                callback(true);
            } else {
                callback(false);
            }
        });
        console.log("Registered ignition event for vehicle id: " + vehicle_id);
    }
}

module.exports = MojioUser;