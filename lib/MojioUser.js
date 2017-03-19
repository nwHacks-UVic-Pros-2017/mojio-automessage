"use strict";

var MojioClientLite = require('mojio-client-lite');
var vehicle_url = "https://push.moj.io/v2/vehicles/";
/*
 * MojioUser: interface for interacting with the Mojio API. Retains OAuth credentials
 * for a user.
 *
 * Created by charlie on 2017-03-18.
 */
class MojioUser {

    constructor() {

        this.auth_state = false;

        var moj_config = {
            application : process.env.MOJIO_API_KEY,
            secret: process.env.MOJIO_SECRET_KEY
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

    get_user_vechiles(callback) {
        var self = this;
        this._mojio_client.get().vehicles().then(function(res, err) {
            if (err == null) {
                var vehicles = res.Data.map(function(vehicle) {
                    return { "Name": self.get_vehicle_name(vehicle), "Id" : vehicle.Id };
                });
                callback(vehicles);
            } else {
                callback(null);
            }
        });
    }

    get_vehicle_name(vehicle) {
        if (vehicle.Name) {
            return vehicle.Name;
        } else if (vehicle.LicensePlate) {
            return vehicle.LicensePlate;
        } else {
            return vehicle.VIN;
        }
    }

    setup_ignition_event(vehicle_id, base_url, callback) {
        var address = base_url + "/"  + vehicle_id + "/ignition_on";
        var key = vehicle_id + "-ignition_on";
        var data = {
            "Key": key,
            "Conditions": "IgnitionState.Value eq true",
            "Timing": "Leading",
            "Transports": [
                {
                    "Type": "HttpPost",
                    "Address": address
                }
            ]
        };
        this._mojio_client.post(vehicle_url + vehicle_id + "?force=true", data).then(function(res,err) {
            if (err == null) {
                callback(key);
            } else {
                console.log(err);
                callback(err);
            }
        });
    }

    get_address(vehicle_id, callback) {
        this._mojio_client.get().vehicles(vehicle_id).then(function(res, err) {
            if (err == null) {
                var location = {"Lat" : res.Data[0].Location.Lat, "Lng": res.Data[0].Location.Lng};
                console.log(location);
                callback(location);
            } else {
                callback(null);
            }
         });
    }

    delete_observer(key, callback) {
        this._mojio_client.delete(vehicle_url + key).then(function(res, err) {
            console.log(res);
            if (err == null) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }
}

module.exports = MojioUser;