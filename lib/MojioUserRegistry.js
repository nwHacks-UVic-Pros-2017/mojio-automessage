/**
 * Created by charlie on 2017-03-19.
 */

class MojioUserRegistry {

    constructor() {
        this._objects = {};
    }

    getBySessionId(sessionId) {
        return this._objects[sessionId];
    }

    register(sessionId, client) {
        this._objects[sessionId] = client;
    }

}

module.exports = MojioUserRegistry;