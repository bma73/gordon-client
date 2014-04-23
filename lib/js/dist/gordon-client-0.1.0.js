this.gordon = this.gordon || {};

this.gordon.message = {
    JOIN: 0,
    JOIN_ERROR: 1,
    NEW_USER: 2,
    CHANGE_ROOM: 3,
    CHANGE_ROOM_ERROR: 4,
    USER_CHANGED_ROOM: 5,
    MASTER: 6,
    USER_LEFT: 7,
    DATA_OBJECT_UPDATE: 8,
    DATA_OBJECT_DELETE: 9,
    DATA_OBJECT_CREATED: 10,
    INIT_DATA_OBJECT: 18,

    GET_SESSION_LIST: 11,
    GET_ROOM_LIST: 12,
    GET_USER_LIST: 13,
    CHAT_MESSAGE: 14,
    CUSTOM_MESSAGE: 15,

    PING: 16
};




/**
 * Gordon events
 *
 * @module gordon
 */

this.gordon = this.gordon || {};

this.gordon._eventId = 0;

(function () {
    'use strict';
    /**
     * Event
     *
     * @class Event
     * @constructor
     */
    function Event() {
        this._listeners = {};
        this.id = Math.random() + " " + gordon._eventId++;
    }

    var p = Event.prototype;
    p.superconstructor = Event;

    /**
     * Adds a listener to the given event name.
     *
     * @method on
     * @chainable
     * @param {String} event The event name
     * @param {Function}callback Callback function
     */
    p.on = function (event, listener) {
        var list = this._listeners[event];
        if (!list) {
            list = this._listeners[event] = [];
        }
        else {
            if (list.indexOf(listener) != -1) return;
        }
        list.push(listener);
        return this;
    };


    /**
     * Adds a listener to the given event name. (Substitute for {{#crossLink "Event/on:method"}}{{/crossLink}})
     *
     * @method addEventListener
     * @chainable
     * @param {String} event The event name
     * @param {Function}callback Callback function
     */
    p.addEventListener = p.on;


    /**
     * Adds a listener to the given event name.
     *
     * @method removeListener
     * @chainable
     * @param {String} event The event name
     * @param {Function}callback Callback function
     */
    p.removeListener = function (event, listener) {
        var list = this._listeners[event];
        if (!list) return;
        var index = list.indexOf(listener);
        if (index == -1) return;
        list.splice(index, 1);
        return this;
    };

    /**
     * Adds a listener to the given event name, that is triggered only once.
     *
     * @method removeListener
     * @chainable
     * @param {String} event The event name
     * @param {Function}callback Callback function
     */
    p.once = function (type, listener) {
        function g() {
            this.removeListener(type, g);
            listener.apply(this, arguments);
        }

        g.listener = listener;
        this.on(type, g);
        return this;
    };

    /**
     * Remove all listeners of the given event name.
     *
     * @method removeListener
     * @chainable
     * @param {String} event The event name
     * @param {Function}callback Callback function
     */
    p.removeAllListeners = function (event) {
        if (this._listeners[event] == null) return;
        this._listeners[event] = null;
        delete this._listeners[event];
        return this;
    };

    /**
     * Get all listeners to the given event name.
     *
     * @method listeners
     * @param {String} eventName
     * @returns {Array} list
     */
    p.listeners = function (event) {
        var list = this._listeners[event];
        if (!list) return 0;
        return list.slice();
    };

    /**
     * Get the number of listener to the given event name.
     *
     * @method listenerCount
     * @param {String} eventName
     * @returns {Number} value
     */
    p.listenerCount = function (event) {
        var list = this._listeners[event];
        if (!list) return 0;
        return list.length();
    };

    /**
     * Emits a event.
     *
     * <code>
     *     this.emit('eventName', 1, 'status', 5);
     * </code>
     *
     * @method emit
     * @chainable
     * @param {String} eventName
     * @param ...args
     * @returns {Number} value
     */

    p.emit = function (event) {
        var list = this._listeners[event];
        if (!list) return;

        var len = arguments.length;
        var args = new Array(len - 1);
        for (var i = 1; i < len; i++)
            args[i - 1] = arguments[i];

        var listeners = list.slice();
        len = listeners.length;
        for (i = 0; i < len; i++)
            listeners[i].apply(this, args);
        return this;
    };

    /**
     * Disposes the event instance.
     *
     * @method dispose
     * @chainable
     */
    p.dispose = function () {
        this._listeners = null;
        return this;
    };


    /**
     * Fired when web socket has connected
     *
     * @event connected
     */
    Event.CONNECTED = "connected";

    /**
     * Fired when web socket has disconnected
     *
     * @event closed
     */
    Event.CLOSED = "closed";

    /**
     * Status of a join room request
     *
     * @event joined
     */
    Event.JOINED = "joined";

    /**
     * Fired when a new user has joined the current room
     *
     * @event newUser
     */
    Event.NEW_USER = "newUser";

    /**
     * Fired when a new user has left the current room
     *
     * @event userLeft
     */
    Event.USER_LEFT = "userLeft";

    /**
     * Status of a change room request
     *
     * @event roomChanged
     */
    Event.ROOM_CHANGED = "roomChanged";

    /**
     * Ping value updated
     *
     * @event ping
     */
    Event.PING = "ping";

    /**
     * A custom message has arrived
     *
     * @event customMessage
     */
    Event.CUSTOM_MESSAGE = "customMessage";

    /**
     * A new room-wide chat message has been sent
     *
     * @event chatMessage
     */
    Event.CHAT_MESSAGE = "chatMessage";

    /**
     * A private message has been sent
     *
     * @event privateChatMessage
     */
    Event.PRIVATE_CHAT_MESSAGE = "privateChatMessage";


    /**
     * A new {{#crossLink "DataObject"}}{{/crossLink}} has been created
     *
     * @event newDataObject
     */
    Event.NEW_DATA_OBJECT = "newDataObject";

    /**
     * A {{#crossLink "DataObject"}}{{/crossLink}} has been removed
     *
     * @event dataObjectRemoved
     */
    Event.DATA_OBJECT_REMOVED = "dataObjectRemoved";

    /**
     * A {{#crossLink "DataObject"}}{{/crossLink}} has been updated
     *
     * @event dataObjectUpdate
     */
    Event.DATA_OBJECT_UPDATE = "dataObjectUpdate";

    /**
     * Client has become the room master.
     * @event master
     */
    Event.MASTER = "master";


    gordon.Event = Event;

}());
/**
 * @module gordon
 */

this.gordon = this.gordon || {};

/**
 * Gordon Utilities
 *
 * @class Util
 * @static
 */

this.gordon.Util = {

    toUtf8Buffer: function (str) {
        var ret = [];
        var l = str.length;
        for (var i = 0; i < l; ++i) {
            var c = str.charCodeAt(i);
            ret[i] = c;
        }
        return ret;
    },

    /**
     * Converts a buffer to an Utf-8 String
     *
     * @method bufferToUtf8String
     * @param {Buffer} buffer
     * @param {Number} [offset]
     * @param {Boolean} [length]
     * @returns {String} string
     */
    bufferToUtf8String: function (buffer, offset, length) {
        offset = offset || 0;
        length = length || buffer.length;
        return decodeURIComponent(encodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(buffer, offset, length))));
    },

    /**
     * Converts an Utf-8 string to an Uint8 array
     *
     * @method bufferToUtf8String
     * @param {String} str
     * @param {Buffer} buffer
     * @param {Number} [offset]
     * @returns {String} string
     */
    utf8StringToBuffer: function (str, buffer, offset) {
        var strUtf8 = decodeURIComponent(encodeURIComponent(str));
        var ab = new Uint8Array(buffer, offset, strUtf8.length);
        for (var i = 0; i < strUtf8.length; i++) {
            ab[i] = strUtf8.charCodeAt(i);
        }
        return ab;
    },

    writeArrayToBuffer: function (view, offset, array) {
        var l = array.length;
        for (var i = 0; i < l; ++i) {
            view.setUint8(offset + i, array[i]);
        }
    },

    /**
     * Copy bytes from source to target buffer
     *
     * @method copyBytes
     * @param {ArrayBuffer} target The target buffer to copy to.
     * @param {ArrayBuffer} source The source buffer to copy from.
     * @param {Number} [targetOffsetBytes]
     * @param {Number} [sourceOffsetBytes]
     * @param {Number} [sourceLengthBytes]
     */
    copyBytes: function (target, source, targetOffsetBytes, sourceOffsetBytes, sourceLengthBytes) {
        var t = new Uint8Array(target);
        var s = new Uint8Array(source, sourceOffsetBytes || 0, sourceLengthBytes || source.length);
        t.set(s, targetOffsetBytes || 0);
    },

    /**
     * Dumps a buffer to string
     *
     * @method hexDump
     * @param {ArrayBuffer} sourceBuffer
     * @param {Number} [offset]
     * @param {Number} [length]
     * @returns {String} string
     */
    hexDump: function (sourceBuffer, offset, length) {
        'use strict';
        var fillUp = gordon.Util._fillUp;
        var view = new DataView(sourceBuffer);
        offset = offset || 0;
        length = length || sourceBuffer.byteLength;

        var out = fillUp("Offset", 8, " ") + "  00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F\n";
        var row = "";
        for (var i = 0; i < length; i += 16) {
            row += fillUp(offset.toString(16).toUpperCase(), 8, "0") + "  ";
            var n = Math.min(16, length - offset);
            var string = "";
            for (var j = 0; j < 16; ++j) {
                if (j < n) {
                    var value = view.getUint8(offset);
                    string += value >= 32 ? String.fromCharCode(value) : ".";
                    row += fillUp(value.toString(16).toUpperCase(), 2, "0") + " ";
                    offset++;
                }
                else {
                    row += "   ";
                    string += " ";
                }
            }
            row += " " + string + "\n";
        }
        out += row;
        return out;
    },

    _fillUp: function (value, count, fillWith) {
        var l = count - value.length;
        var ret = "";
        while (--l > -1)
            ret += fillWith;
        return ret + value;
    },

    extend: function (subclass, superclass) {
        var f = function() {};
        f.prototype = superclass.prototype;
        subclass.prototype = new f();
        subclass.prototype.constructor = subclass;
        subclass.superclass = superclass.prototype;
        if (superclass.prototype.constructor == Object.prototype.constructor) {
            superclass.prototype.constructor = superclass;
        }
    }
};

(function () {
    'use strict';
    /**
     * Provides a basic dictionary class
     *
     * @example
     * <pre>
     *     var dict = new gordon.Dictionary();
     *     dict.put('key1', {id:'1234', text:'Hello!'});
     *     dict.put('key2', 0xc000);
     *     console.log(dict.hasKey('key1'));
     *     console.log(dict.keysToArray());
     * </pre>
     *
     * @class Dictionary
     * @constructor
     */
    var Dictionary = function (initData) {
        this._values = {};
        this.length = 0;
        if (initData) {
            for (var key in initData) {
                this._values[key] = initData[key];
            }
        }
    };
    var p = Dictionary.prototype;

    /**
     * Adds a key/value pair
     *
     * @method put
     * @param {String} key
     * @param {*} value
     * @returns {*} value
     */
    p.put = function (key, value) {
        if (!this._values[key]) this.length++;
        this._values[key] = value;
        return value;
    };


    /**
     * Gets a value
     *
     * @method get
     * @param {String} key
     * @returns {*} value
     */
    p.get = function (key) {
        return this._values[key];
    };

    /**
     * Removes a key
     *
     * @method remove
     * @param {String} key
     * @param {Boolean} [disposeValue] If 'true' and calls a 'dispose' method if owned by the value.
     * @returns {*} value
     */
    p.remove = function (key, disposeValue) {
        if (!this._values[key]) this.length--;
        var value = this._values[key];
        if (disposeValue) {
            if ("dispose" in value) value.dispose();
        }
        this._values[key] = null;
        delete this._values[key];
        return value;
    };

    /**
     * Disposes the Dictionary instance
     *
     * @method dispose
     * @param {Boolean} [disposeValue] If 'true' and calls a 'dispose' method if owned by the values.
     */
    p.dispose = function (disposeValues) {
        for (var i in this._values) {
            this.remove(i, disposeValues);
        }
        this.length = 0;
    };

    /**
     * Checks if a key exists
     *
     * @method hasKey
     * @param {String} key
     * @returns {Boolean} value
     */
    p.hasKey = function (key) {
        return this._values[key] !== null;
    };

    /**
     * Returns all keys as an array
     *
     * @method keysToArray
     * @returns {Array} keys
     */
    p.keysToArray = function () {
        var ret = [];
        for (var key in this._values) {
            ret.push(key);
        }
        return ret;
    };

    /**
     * Returns all values as an array
     *
     * @method valuesToArray
     * @returns {Array} values
     */
    p.valuesToArray = function () {
        var ret = [];
        for (var key in this._values) {
            ret.push(this._values[key]);
        }
        return ret;
    };

    /**
     * Clones the Dictionary
     *
     * @returns {Dictionary} dict
     */
    p.clone = function () {
        var d = new gordon.Dictionary();
        for (var i in this._values) {
            d.put(i, this._values[i]);
        }
        return d;
    };

    gordon.Dictionary = Dictionary;
}());


(function () {
    'use strict';

    /**
     * Timer with timeDelta
     *
     * @class Timer
     * @constructor
     * @param {Number} intervalMillis The update interval in milliseconds.
     * @param {Boolean} [autoStart] Starts the timer automatically. Default is true.
     */

    function Timer(intervalMillis, autoStart) {
        autoStart = autoStart || true;
        this.tickAmount = intervalMillis || 33.33333;
        this.time = 0;
        this._callbacks = [];
        this._lastTime = this._startTime = Date.now();
        if (autoStart) this.start();
    }
    /**
     * Stops the timer.
     *
     * @method stop
     */
    Timer.prototype.stop = function(){
        clearTimeout(this.timeout);
    };

    /**
     * Starts the timer.
     *
     * @method start
     */
    Timer.prototype.start = function(intervalMillis){
        this.tickAmount = intervalMillis || this.tickAmount;
        this.timeout = setTimeout(this._loop.bind(this), this.tickAmount);
    };

    Timer.prototype._loop = function () {
        var now = Date.now();
        var delta = (now - this._lastTime) / this.tickAmount;
        this.time += this.tickAmount;
        var callbacks = this._callbacks;
        var l = callbacks.length;
        for (var i = 0; i < l; ++i) {
            var o = callbacks[i];
            if (!o.loop) continue;
            o.loop.apply(o, [delta, this.time]);
        }
        this._lastTime = now;
        var diff = (now - this._startTime) - this.time;
        this.timeout = setTimeout(this._loop.bind(this), (this.tickAmount - diff));
    };

    /**
     * Adds an object to the update loop.
     * The added object must implement a 'loop' method.
     * The timer instance passes two params to the loop method:
     * <pre>
     *     delta The time delta factor.
     *     time  The total time the timer is running.
     * </pre>
     *
     * @example
     * <pre>
     *     var foo = {
     *          loop: function(timeDelta, time) {
     *              console.log('timeDelta:', timeDelta);
     *              console.log('time:', time);
     *          };
     *     };
     *     var timer = new gordon.Timer(1000 / 30);
     *     timer.addObject(foo);
     *
     * </pre>
     *
     * @method addObject
     * @param {Object} object The object that should be added to the update loop.
     */
    Timer.prototype.addObject = function (object) {
        this._callbacks.push(object);
    };

    /**
     * Stops the timer.
     *
     * @method removeObject
     * @param {Object} object The object that should be removed from the update loop.
     */
    Timer.prototype.removeObject = function (object) {
        var index = this._callbacks.indexOf(object);
        if (index == -1) return;
        this._callbacks.splice(index, 1);
    };

    /**
     * Disposes the timer.
     *
     * @method dispose
     */
    Timer.prototype.dispose = function () {

        this._callbacks = null;
    };
    gordon.Timer = Timer;
}());


if (!ArrayBuffer.prototype.slice) {
    ArrayBuffer.prototype.slice = function (start, end) {
        var that = new Uint8Array(this);
        if (end === undefined) end = that.length;
        var result = new ArrayBuffer(end - start);
        var resultArray = new Uint8Array(result);
        for (var i = 0; i < resultArray.length; i++)
            resultArray[i] = that[i + start];
        return result;
    };
}


/**
 * Gordon room
 *
 * @module gordon
 */

this.gordon = this.gordon || {};

(function () {
    'use strict';

    /**
     * A Room instance stores information about the current room.
     * Users and DataObjects are grouped in a room.
     *
     * @class Room
     * @constructor
     */
    var Room = function (id) {
        this.id = id;
        this._users = new gordon.Dictionary();
        this._dataObjects = new gordon.Dictionary();
        this.data = {};

        /**
         * The master user of this room.
         * Every room has one dedicated master user. The master changes automatically
         * if the current master user left the room.
         * @property master
         * @type User
         **/
        this.master = null;
    };

    var p = Room.prototype;

    /**
     * Get a user by id.
     *
     * @method getUser
     * @param id
     * @returns {User}
     */
    p.getUser = function (id) {
        return this._users.get(id);
    };

    /**
     * Get all users.
     *
     * @method getUsers
     * @returns {Array} list An array with User instances
     */
    p.getUsers = function() {
      return this._users.valuesToArray();
    };

    /**
     * Adds a dataObject to the room.
     *
     * @param {DataObject} dataObject The dataObject to add
     * @param {String} [password] If the new room is locked with a password
     * @param {Function}[callback] Callback function
     * @param {String} callback.eventName {{#crossLink "Event/roomChanged:event"}}{{/crossLink}}
     * @param {String} callback.errorId {{#crossLink "Codes"}}{{/crossLink}} Will be null if everything is ok.
     * @param {String} callback.room {{#crossLink "Room"}}{{/crossLink}} The new Room object.
     */
    p.addDataObject = function(dataObject, updatePolicy, callback/*(DataObject)*/) {
        var callbackId = this._main._structure.initDataObject(dataObject, callback);
        this._main._protocol.out_initDataObject(dataObject, updatePolicy, callbackId);
    };


    /**
     * Get a dataObject by id.
     *
     * @param {Number} id
     * @returns {DataObject} dataObject
     */
    p.getDataObject = function(id){
        return this._dataObjects.get(id);
    };

    /**
     * Get all dataObjects
     *
     * @returns {Array} list
     */
    p.getDataObjects = function(){
        return this._dataObjects.valuesToArray();
    };

    /**
     * Get the number of users in this room.
     *
     * @returns {Array} list
     */
    p.getUserCount = function(){
      return this._users.length;
    };


    p.__addUser = function (user) {
        this._users.put(user.id, user);
        return user;
    };

    p.__removeUser = function (id) {
        return this._users.remove(id);
    };

    p.__dispose = function () {
        this._users.dispose();
        this._dataObjects.dispose();
        this.id = -1;
        this._users = null;
        this._dataObjects = null;
        this.data = null;
    };

    gordon.Room = Room;

}());



/**
 * @module gordon
 */


this.gordon = this.gordon || {};

(function () {
    'use strict';
    /**
     * Every client connected to the Gordon Server and joined to a session is represented as a user.<br>
     * Users can interact with each other by updating their {{#crossLink "DataObject"}}DataObjects{{/crossLink}}, sending {{#crossLink "Client/sendChatMessage:method"}}chat{{/crossLink}} or {{#crossLink "Client/sendCustomMessage:method"}}custom{{/crossLink}} messages.
     *
     * @class User
     * @constructor
     * @extends Event
     */
    function User() {

        /**
         * User id
         *
         * @property id
         * @type {Number}
         */
        this.id = -1;

        /**
         * Master flag.
         * Every room has one dedicated master.
         *
         * @property master
         * @type {Boolean}
         * @default false
         */
        this.master = false;

        /**
         * User DataObject
         *
         * @property dataObject
         * @type {DataObject}
         */

        /**
         * User Room
         *
         * @property room
         * @type {Room}
         */

        this.superconstructor();
    };

    var p = User.prototype = new gordon.Event();

    p.__dispose = function () {
        if (this.dataObject) this.dataObject.dispose();
        this.room = null;
        this.id = -1;
    };

    /**
     * User has left the room / server.
     *
     * @event dispose
     * @param {User} user
     */
    User.DISPOSE = "dispose";

    /**
     * User received a private message.
     *
     * @event chatMessage
     * @param {User} sender
     * @param {String} message
     */
    User.CHAT_MESSAGE = "chatMessage";

    gordon.User = User;

}());



/**
 * @module gordon
 */

this.gordon = this.gordon || {};

(function () {
    'use strict';
    /**
     * DataObject are used to synchronize states between the connected clients.
     * Every DataObject consists of key/value pairs, where keys must be unique integers (per DataObject).
     *
     * Every {{#crossLink "User"}}{{/crossLink}} has his own DataObject. Additional DataObjects could be created by
     * a client or by the server.
     *
     * DataObjects could be used to represent objects like e.g. bots, windows, laser shots, grenades,
     * barrels, text blocks, cars etc.
     *
     * @example
     *  <pre>
     *    var dataX = this.dataObject.getInt16(Player.KEY_X_POS);
     *    var dataY = this.dataObject.getInt16(Player.KEY_Y_POS);
     *    if (dataX != this._mouseX) {
     *        this.dataObject.setInt16(Player.KEY_X_POS, this._mouseX);
     *     }
     *     if (dataY != this._mouseY) {
     *         this.dataObject.setInt16(Player.KEY_Y_POS, this._mouseY);
     *     }
     *    this.dataObject.sendUpdates();
     *   </pre>
     *
     * @class DataObject
     * @constructor
     * @extends Event
     */
    function DataObject() {
        this.values = {};
        this.__updatedKeys = [];
        this.updatedKeys = [];
        this.initialized = false;
        this.updatePolicy = 0;
        this.id = -1;
        this._dataView = new DataView(new ArrayBuffer(1));
        this.superconstructor();
    }

    var p = DataObject.prototype = new gordon.Event();


    /**
     * Sets a string.
     *
     * @method setString
     * @chainable
     * @param {Number} key The unique key
     * @param {String} value The string value
     * @param {Boolean} [send] Immediately send the update to the server. Default is false.
     */
    p.setString = function (key, value, send) {
        if (key == null) throw new Error('Key is missing.');
        if (value == null) throw new Error('Value is missing.');
        send = send || false;
        var buffer = new ArrayBuffer(value.length);
        this.values[key] = gordon.Util.utf8StringToBuffer(value, buffer, 0);
        this._checkSend(key, send);
        return this;
    };

    /**
     * Returns a string from a key.
     *
     * @method getString
     * @param {Number} key The unique key
     * @returns {String} value
     */
    p.getString = function (key) {
        return gordon.Util.bufferToUtf8String(this.values[key]);
    };

    /**
     * Sets an object.
     *
     * @method setObject
     * @chainable
     * @param {Number} key The unique key
     * @param {Object} value The object
     * @param {Boolean} [send] Immediately send the update to the server. Default is false.
     */
    p.setObject = function (key, value, send) {
        if (key == null) throw new Error('Key is missing.');
        if (value == null) throw new Error('Value is missing.');
        send = send || false;
        var str = JSON.stringify(value);
        var buffer = new ArrayBuffer(str.length);
        this.values[key] = gordon.Util.utf8StringToBuffer(str, buffer, 0);
        this._checkSend(key, send);
        return this;
    };

    /**
     * Returns an object from a key.
     *
     * @method getObject
     * @param {Number} key The unique key
     * @returns {Object} value
     */
    p.getObject = function (key) {
        var str = gordon.Util.bufferToUtf8String(this.values[key]);
        return JSON.parse(str);
    };

    /**
     * Sets an Int8 value.
     *
     * @method setInt8
     * @chainable
     * @param {Number} key The unique key
     * @param {Number} value
     * @param {Boolean} [send] Immediately send the update to the server. Default is false.
     */
    p.setInt8 = function (key, value, send) {
        if (key == null) throw new Error('Key is missing.');
        if (value == null) throw new Error('Value is missing.');
        send = send || false;
        var v = this.values[key];
        if (!v) v = this.values[key] = new ArrayBuffer(1);
        new DataView(v).setInt8(0, value);
        this._checkSend(key, send);
    };

    /**
     * Returns an Int8 value from a key.
     *
     * @method getInt8
     * @param {Number} key The unique key
     * @returns {Number} value
     */
    p.getInt8 = function (key) {
        return new DataView(this.values[key]).getInt8(0);
    };


    /**
     * Sets an Uint8 value.
     *
     * @method setUint8
     * @chainable
     * @param {Number} key The unique key
     * @param {Number} value
     * @param {Boolean} [send] Immediately send the update to the server. Default is false.
     */
    p.setUint8 = function (key, value, send) {
        if (key == null) throw new Error('Key is missing.');
        if (value == null) throw new Error('Value is missing.');
        send = send || false;
        var v = this.values[key];
        if (!v) v = this.values[key] = new ArrayBuffer(1);
        new DataView(v).setUint8(0, value);
        this._checkSend(key, send);
        return this;
    };

    /**
     * Returns an Uint8 value from a key.
     *
     * @method getUint8
     * @param {Number} key The unique key
     * @returns {Number} value
     */
    p.getUint8 = function (key) {
        return new DataView(this.values[key]).getUint8(0);
    };

    /**
     * Sets an Int16 value.
     *
     * @method setInt16
     * @chainable
     * @param {Number} key The unique key
     * @param {Number} value
     * @param {Boolean} [send] Immediately send the update to the server. Default is false.
     */

    p.setInt16 = function (key, value, send) {
        if (key == null) throw new Error('Key is missing.');
        if (value == null) throw new Error('Value is missing.');
        send = send || false;
        var v = this.values[key];
        if (!v) v = this.values[key] = new ArrayBuffer(2);
        new DataView(v).setInt16(0, value);
        this._checkSend(key, send);
        return this;
    };

    /**
     * Returns an Int16 value from a key.
     *
     * @method getInt16
     * @param {Number} key The unique key
     * @returns {Number} value
     */
    p.getInt16 = function (key) {
        return new DataView(this.values[key]).getInt16(0);
    };

    /**
     * Sets an Uint16 value.
     *
     * @method setUint16
     * @chainable
     * @param {Number} key The unique key
     * @param {Number} value
     * @param {Boolean} [send] Immediately send the update to the server. Default is false.
     */
    p.setUint16 = function (key, value, send) {
        if (key == null) throw new Error('Key is missing.');
        if (value == null) throw new Error('Value is missing.');
        send = send || false;
        var v = this.values[key];
        if (!v) v = this.values[key] = new ArrayBuffer(2);
        new DataView(v).setUint16(0, value);
        this._checkSend(key, send);
        return this;
    };

    /**
     * Returns an Uint16 value from a key.
     *
     * @method getUint16
     * @param {Number} key The unique key
     * @returns {Number} value
     */
    p.getUint16 = function (key) {
        return new DataView(this.values[key]).getUint16(0);
    };

    /**
     * Sets an Int32 value.
     *
     * @method setInt32
     * @chainable
     * @param {Number} key The unique key
     * @param {Number} value
     * @param {Boolean} [send] Immediately send the update to the server. Default is false.
     */
    p.setInt32 = function (key, value, send) {
        if (key == null) throw new Error('Key is missing.');
        if (value == null) throw new Error('Value is missing.');
        send = send || false;
        var v = this.values[key];
        if (!v) v = this.values[key] = new ArrayBuffer(4);
        new DataView(v).setInt32(0, value);
        this._checkSend(key, send);
        return this;
    };

    /**
     * Returns an Int32 value from a key.
     *
     * @method getInt32
     * @param {Number} key The unique key
     * @returns {Number} value
     */
    p.getInt32 = function (key) {
        return new DataView(this.values[key]).getInt32(0);
    };

    /**
     * Sets an Uint32 value.
     *
     * @method setUint32
     * @chainable
     * @param {Number} key The unique key
     * @param {Number} value
     * @param {Boolean} [send] Immediately send the update to the server. Default is false.
     */
    p.setUint32 = function (key, value, send) {
        if (key == null) throw new Error('Key is missing.');
        if (value == null) throw new Error('Value is missing.');
        send = send || false;
        var v = this.values[key];
        if (!v) v = this.values[key] = new ArrayBuffer(4);
        new DataView(v).setUint32(0, value);
        this._checkSend(key, send);
    };

    /**
     * Returns an Uint32 value from a key.
     *
     * @method getUint32
     * @param {Number} key The unique key
     * @returns {Number} value
     */
    p.getUint32 = function (key) {
        return new DataView(this.values[key]).getUint32(0);
    };

    /**
     * Sets a Float32 value.
     *
     * @method setFloat32
     * @chainable
     * @param {Number} key The unique key
     * @param {Number} value
     * @param {Boolean} [send] Immediately send the update to the server. Default is false.
     */
    p.setFloat32 = function (key, value, send) {
        if (key == null) throw new Error('Key is missing.');
        if (value == null) throw new Error('Value is missing.');
        send = send || false;
        var v = this.values[key];
        if (!v) v = this.values[key] = new ArrayBuffer(4);
        new DataView(v).setFloat32(0, value);
        this._checkSend(key, send);
    };

    /**
     * Returns an Float32 value from a key.
     *
     * @method getFloat32
     * @param {Number} key The unique key
     * @returns {Number} value
     */
    p.getFloat32 = function (key) {
        return new DataView(this.values[key]).getFloat32(0);
    };

    /**
     * Sets a Float64 value.
     *
     * @method setFloat64
     * @chainable
     * @param {Number} key The unique key
     * @param {Number} value
     * @param {Boolean} [send] Immediately send the update to the server. Default is false.
     */
    p.setFloat64 = function (key, value, send) {
        if (key == null) throw new Error('Key is missing.');
        if (value == null) throw new Error('Value is missing.');
        send = send || false;
        var v = this.values[key];
        if (!v) v = this.values[key] = new ArrayBuffer(8);
        new DataView(v).setFloat64(0, value);
        this._checkSend(key, send);
    };

    /**
     * Returns an Float64 value from a key.
     *
     * @method getFloat64
     * @param {Number} key The unique key
     * @returns {Number} value
     */
    p.getFloat64 = function (key) {
        return new DataView(this.values[key]).getFloat64(0);
    };

    p.getBufferSize = function (keys) {
        var l = 2; //objectId
        if (!keys || keys.length === 0) {
            for (var i in this.values) {
                l += 2; //keyid
                l += 4;
                l += this.values[i].byteLength; //value
            }
        } else {
            for (i in keys) {
                l += 2; //keyid
                l += 4;
                l += this.values[keys[i]].byteLength; //value
            }
        }
        return l;
    };

    /**
     * Immediately sends all pending updates to the server.
     *
     * @method sendUpdates
     * @chainable
     * @param {Boolean} [broadcast] Broadcast the updates to all other users in the according room.
     * Default is true.
     */
    p.sendUpdates = function (broadcast) {
        broadcast = broadcast || true;
        if (!this.initialized) return;
        if (this.__updatedKeys.length === 0) return;
        this.__main._protocol.out_dataObjectUpdate(this, broadcast);
        this.__updatedKeys.length = 0;
        return this;
    };

    /**
     * Clear the pending updates list.
     *
     * @method clearUpdatedKeys
     * @chainable
     */
    p.clearUpdatedKeys = function () {
        this.__updatedKeys.length = 0;
        return this;
    };

    p.dispose = function () {

        for (var i in this.values) {
            this.values[i] = null;
            delete this.values[i];
        }
        this.values = null;
        this.__main = null;
        this.__updatedKeys = null;

    };

    p._checkSend = function (key, send) {
        if (this.__updatedKeys.indexOf(key) == -1) this.__updatedKeys.push(key);
        if (send) this.sendUpdates();
    };

    DataObject.DISPOSE = "dispose";
    DataObject.INITIALIZED = "init";
    DataObject.UPDATE = "update";

    gordon.DataObject = DataObject;


}());

this.gordon = this.gordon || {};

(function () {
    'use strict';
    var Structure = function (main) {
        this.rooms = new gordon.Dictionary();
        this._dataObjects = new gordon.Dictionary();
        this._callbackPool = new gordon.Dictionary();
        this._callbackId = 0;
        this._main = main;
    };

    var p = Structure.prototype;

    p.dispose = function () {
        this.rooms.dispose();
        this._dataObjects.dispose(true);
        this._callbackPool.dispose();
        this.rooms = null;
        this._dataObjects = null;
        this._callbackPool = null;
        this._main = null;
    };

    p.addDataObject = function (dataObject) {
        this._dataObjects.put(dataObject.id, dataObject);
    };

    p.getDataObject = function (id) {
        return this._dataObjects.get(id);
    };

    p.removeDataObject = function (id) {
        return this._dataObjects.remove(id);
    };

    p.addRoom = function (roomId) {
        var room = new gordon.Room();
        room.id = roomId;
        room._main = this._main;
        this.rooms.put(roomId, room);
        return room;
    };

    p.removeRoom = function (roomId) {
        var room = this.rooms.remove(roomId);
        room.__dispose();
        return room;
    };

    p.getRoom = function (roomId, autoAdd) {
        var room = this.rooms.get(roomId);
        if (!room) {
            if (autoAdd) {
                room = this.addRoom(roomId);
            }
        }
        return room;
    };

    p.initDataObject = function (dataObject, callback) {
        var id = this._callbackId++;
        if (this._callbackId > 0xffff) this._callbackId = 1;
        this._callbackPool.put(id, [dataObject, callback]);
        return id;
    };

    p.putCallbackObject = function (object) {
        var id = this._callbackId++;
        if (this._callbackId > 0xffff) this._callbackId = 1;
        this._callbackPool.put(id, object);
        return id;
    };

    p.getCallbackObject = function (id) {
        return this._callbackPool.remove(id);
    };

    gordon.Structure = Structure;

}());



/**
 * @module gordon
 */

this.gordon = this.gordon || {};

(function () {
    'use strict';
    /**
     * The Gordon Client
     *
     * @class Client
     * @constructor
     * @extends Event
     * @param {Object} [config] A config object
     * @param {Boolean} config.log Enable logging to console. Default is true.
     * @param {Number} config.pingInterval Sets the interval in milliseconds. The default value is 10000.
     * The server uses the client pings to check if the current connection is still valid.
     * @param {Number} config.messageBufferSize Sets the max buffer size for one message. Default is 1024 bytes.
     */
    var Client = function (config) {
        config = config || {};
        if (config.log == null) config.log = true;
        config.pingInterval = config.pingInterval || 10000;
        config.messageBufferSize = config.messageBufferSize || 1024;

        this._config = config;
        this._protocol = new gordon.Protocol(this);
        this._connection = new gordon.Connection(this, this._protocol);
        this._structure = new gordon.Structure(this);
        this.setPingInterval(this._config.pingInterval);
        this.superconstructor();
    };

    var p = Client.prototype = new gordon.Event();
    /**
     * Connects to the Gordon Server
     *
     * @async
     * @method connect
     * @param {String} url The URL to connect to
     * @param {Function}[callback] Callback function
     * @param {String} callback.eventName Event name: {{#crossLink "Event/connected:event"}}{{/crossLink}}
     */
    p.connect = function (url, callback) {
        if (!url) {
            throw "[gordon] Argument missing.";
        }
        if (callback) this.once(gordon.Event.CONNECTED, callback);
        this._connection.connect(url);
    };

    /**
     * Joins a session and room
     * The client has to be connected.
     *
     * @async
     * @method join
     * @param {String} sessionId The unique session id
     * @param {String} roomId The unique room id (unique in the according session scope)
     * @param {String} name The user's nickname
     * @param {DataObject} [dataObject] An optional {{#crossLink "DataObject"}}{{/crossLink}} object which defines the
     * user data attached to this user.<br> If not provided, the system creates an empty {{#crossLink "DataObject"}}{{/crossLink}}.
     * @param {Function}[callback] Callback function
     * @param {String} callback.eventName {{#crossLink "Event/joined:event"}}{{/crossLink}}
     * @param {String} callback.errorId {{#crossLink "ErrorCode"}}{{/crossLink}} Will be null if everything is ok.
     * @param {String} callback.user {{#crossLink "User"}}{{/crossLink}} The User object.
     */
    p.join = function (sessionId, roomId, name, dataObject, callback) {
        if (!sessionId || !roomId || !name) {
            throw "[gordon] Argument missing.";
        }
        if (callback) this.once(gordon.Event.JOINED, callback);
        this._protocol.out_join(sessionId, roomId, name, dataObject);
    };

    /**
     * Change the user's room in the current session.
     * The client has to be connected and already has joined a session/room.
     *
     * @async
     * @method changeRoom
     * @param {String} newRoomId The new room id
     * @param {String} [password] If the new room is locked with a password
     * @param {Function}[callback] Callback function
     * @param {String} callback.eventName {{#crossLink "Event/roomChanged:event"}}{{/crossLink}}
     * @param {String} callback.errorId {{#crossLink "ErrorCode"}}{{/crossLink}} Will be null if everything is ok.
     * @param {String} callback.room {{#crossLink "Room"}}{{/crossLink}} The new Room object.
     */
    p.changeRoom = function (newRoomId, password, callback) {
        if (!newRoomId) {
            throw "[gordon] Argument missing.";
        }
        if (callback) this.once(gordon.Event.ROOM_CHANGED, callback);
        this._protocol.out_changeRoom(newRoomId, password);
    };


    /**
     * Sets the interval in milliseconds. The default value is 10000.
     * The server uses the client pings to check if the current connection is still valid.
     *
     * @method setPingInterval
     * @param {Number} value The new value in millis.
     */
    p.setPingInterval = function (value) {
        this.pingInterval = value;
        this._protocol.setPingInterval(value);
    };

    /**
     * Send a custom binary message to the server.
     * The message is broadcast to all users in the sender's current room.
     * The client has to be connected and already has joined a session/room.
     *
     * @example
     *  <code>
     *   var view = new DataView(new ArrayBuffer(1 + 2));<br>
     *   view.setInt8(0, 11);<br>
     *   view.setUint16(1, 9999);<br>
     *   g.sendCustomMessage(view.buffer);<br>
     *   </code>
     *
     * @method sendCustomMessage
     * @param {Buffer} value
     */
    p.sendCustomMessage = function (value) {
        this._protocol.out_customMessage(value);
    };

    /**
     * Sends a chat text to a specific user or to all users in the current room.
     * The client has to be connected and already has joined a session/room.
     *
     * @method sendChatMessage
     * @param {String} message The text message
     * @param {Number} targetId The id of a {{#crossLink "User"}}{{/crossLink}} or 0 (default) to send to the message
     * to all users in the current room.
     */
    p.sendChatMessage = function (message, targetId) {
        targetId = targetId || 0;
        this._protocol.out_chatMessage(targetId, message);
    };

    /**
     * Get the current ping value
     *
     * @method getCurrentPing
     * @return {Number} The ping value in milliseconds.
     */
    p.getCurrentPing = function () {
        return this._protocol.ping;
    };

    /**
     * Gets the current websocket connection state.
     *
     * @method getConnectionState
     * @return {Number} <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants">state</a>
     */
    p.getConnectionState = function () {
        return this._connection._webSocket.readyState;
    };

    /**
     * Gets the list of all available sessions.
     * The client has to be connected.
     *
     * @method getSessionList
     * @return {Function} callback The callback function
     * @return {Object} callback.list The session list object.
     */
    p.getSessionList = function (callback) {
        var cid = this._structure.putCallbackObject(callback);
        this._protocol.out_getSessionList(cid);
    };

    /**
     * Gets the room list of a session.
     * The client has to be connected.
     *
     * @method getRoomList
     * @return {String} sessionId The unique session id
     * @return {Function} callback The callback function
     * @return {Object} callback.list The room list object.
     */
    p.getRoomList = function (sessionId, callback) {
        var cid = this._structure.putCallbackObject(callback);
        this._protocol.out_getRoomList(sessionId, cid);
    };

    /**
     * Gets the user list of a room.
     * The client has to be connected.
     *
     * @method getUserList
     * @return {String} sessionId The unique session id
     * @return {String} roomId The unique room id
     * @return {Function} callback The callback function
     * @return {Object} callback.list The user list object.
     */
    p.getUserList = function (sessionId, roomId, callback) {
        var cid = this._structure.putCallbackObject(callback);
        this._protocol.out_getUserList(sessionId, roomId, cid);
    };

    /**
     * Disposes the client.
     *
     * @method dispose
     */
    p.dispose = function () {
        this._protocol.dispose();
        this._structure.dispose();
        this._connection.dispose();
        this.me = null;
        this.currentRoom = null;
        this.superconstructor.dispose();
    };

    p._log = function() {
        if (this._config.log) console.log(arguments);
    };

    gordon.Client = Client;


    /**
     * Fired when web socket has connected
     *
     * @event connected
     */

    /**
     * Fired when web socket has disconnected
     *
     * @event closed
     */

    /**
     * Status of a join room request
     *
     * @event joined
     * @param {Number} errorId Null if everything is fine.
     * @param {User} user Null if there's an error.
     */

    /**
     * Fired when a new user has joined the current room
     *
     * @event newUser
     * @param {User} user
     */

    /**
     * Fired when a new user has left the current room
     *
     * @event userLeft
     * @param {User} user
     */

    /**
     * Status of a change room request
     *
     * @event roomChanged
     * @param {Number} errorId Null if everything is fine.
     * @param {Room} room Null if there's an error.
     */

    /**
     * Ping value updated
     *
     * @event ping
     * @param {Number} value
     */

    /**
     * A custom message has arrived
     *
     * @event customMessage
     * @param {<a href="https://developer.mozilla.org/en-US/docs/Web/API/DataView">DataView</a>} dataView
     */

    /**
     * A new room-wide chat message has been sent
     *
     * @event chatMessage
     * @param {User} sender
     * @param {String} message
     */

    /**
     * A private message has been sent
     *
     * @event privateChatMessage
     * @param {User} sender
     * @param {User} target
     * @param {String} message
     */

    /**
     * A new {{#crossLink "DataObject"}}{{/crossLink}} has been created
     *
     * @event newDataObject
     * @param {DataObject} dataObject
     */

    /**
     * A {{#crossLink "DataObject"}}{{/crossLink}} has been removed
     *
     * @event dataObjectRemoved
     * @param {DataObject} dataObject
     */

    /**
     * Client has become the room master.
     * @event master
     */

}());



this.gordon = this.gordon || {};

(function () {
    'use strict';

    var Connection = function (client, protocol) {
        this._client = client;
        this._protocol = protocol;
        this.url = "";

    };

    var p = Connection.prototype;

    p.connect = function (url) {
        var that = this;
        this.url = url;
        this._webSocket = new WebSocket(this.url, ["gordon-protocol"]);
        this._webSocket.binaryType = 'arraybuffer';

        this._webSocket.onopen = function () {
            that._client._log("[gordon] connected");
            that._client.emit(gordon.Event.CONNECTED, 0);
        };

        this._webSocket.onclose = function () {
            that._client._log("[gordon] closed");
            that._client.emit(gordon.Event.CLOSED);
        };

        this._webSocket.onerror = function (error) {
            that._client._log("[gordon] error", error);
            that._client.emit(gordon.Event.CONNECTED, 1);
        };

        this._webSocket.onmessage = function (e) {
            that._protocol.parse(e.data);
        };
    };

    p.send = function (dataView, length) {
       if (this._webSocket.readyState != 1) return;
        var buffer = new ArrayBuffer(length + 4);
        var bufferView = new DataView(buffer);
        bufferView.setUint32(0, length);
        gordon.Util.copyBytes(buffer, dataView.buffer, 4, 0, length);
        this._webSocket.send(buffer);
    };

    p.dispose = function () {
        this._webSocket.close();
        this._webSocket = null;
        this._client = null;
    };

    gordon.Connection = Connection;

}());

this.gordon = this.gordon || {};

(function () {
    'use strict';
    var Protocol = function (main) {
        this._main = main;
        this._arrayBuffer = new ArrayBuffer(main._config.messageBufferSize);
        this._pingSentTime = 0;
        this.ping = -1;

        this._commandHandlers = {};
        this._commandHandlers[gordon.message.JOIN] = this._in_join;
        this._commandHandlers[gordon.message.JOIN_ERROR] = this._in_joinError;
        this._commandHandlers[gordon.message.CHANGE_ROOM] = this._in_changeRoom;
        this._commandHandlers[gordon.message.CHANGE_ROOM_ERROR] = this._in_changeRoomError;
        this._commandHandlers[gordon.message.NEW_USER] = this._in_newUser;
        this._commandHandlers[gordon.message.MASTER] = this._in_master;
        this._commandHandlers[gordon.message.USER_LEFT] = this._in_userLeft;
        this._commandHandlers[gordon.message.CUSTOM_MESSAGE] = this._in_customMessage;
        this._commandHandlers[gordon.message.CHAT_MESSAGE] = this._in_chatMessage;
        this._commandHandlers[gordon.message.PING] = this._in_ping;
        this._commandHandlers[gordon.message.DATA_OBJECT_CREATED] = this._in_dataObjectCreated;
        this._commandHandlers[gordon.message.DATA_OBJECT_DELETE] = this._in_dataObjectDeleted;
        this._commandHandlers[gordon.message.DATA_OBJECT_UPDATE] = this._in_dataObjectUpdate;
        this._commandHandlers[gordon.message.GET_SESSION_LIST] = this._in_getAList;
        this._commandHandlers[gordon.message.GET_ROOM_LIST] = this._in_getAList;
        this._commandHandlers[gordon.message.GET_USER_LIST] = this._in_getAList;
    };

    var p = Protocol.prototype;

    p.dispose = function () {
        this._main = null;
        clearInterval(this._pingInv);
    };

    p.setPingInterval = function (value) {
        var that = this;
        this.pingInterval = value;
        clearInterval(this._pingInv);
        this._pingInv = setInterval(function () {
            that.out_ping();
            that._pingSentTime = Date.now();
        }, value);
    };

    p.clearPingInterval = function () {
        clearInterval(this._pingInv);
    };


    p.parse = function (buffer) {
        var view = new DataView(buffer);
        var messageLength = view.getUint32(0);
        var command = view.getUint8(4);
        if (this._commandHandlers[command]) this._commandHandlers[command].apply(this, [view, 5]);
    };
    //**********************************************************************
    //* In		 														   *
    //**********************************************************************
    p._in_join = function (view, offset) {
        var buffer = view.buffer;

        var id = view.getUint16(offset);
        offset += 2;

        var sessionIdLength = view.getUint16(offset);
        offset += 2;
        var sessionId = gordon.Util.bufferToUtf8String(buffer, offset, sessionIdLength);
        offset += sessionIdLength;

        var roomIdLength = view.getUint16(offset);
        offset += 2;
        var roomId = gordon.Util.bufferToUtf8String(buffer, offset, roomIdLength);
        offset += roomIdLength;

        var dataLength = view.getUint16(offset);
        offset += 2;
        var data = gordon.Util.bufferToUtf8String(buffer, offset, dataLength);
        offset += dataLength;

        this.__dataObject.id = view.getUint16(offset);
        offset += 2;

        var nameLength = view.getUint16(offset);
        offset += 2;
        var name = gordon.Util.bufferToUtf8String(buffer, offset, nameLength);
        offset += nameLength;

        var values = this.__dataObject.values;
        var l = buffer.byteLength;
        while (offset < l) {
            var key = view.getUint16(offset);
            offset += 2;
            var valueLength = view.getUint32(offset);
            offset += 4;
            var value = new ArrayBuffer(valueLength);
            gordon.Util.copyBytes(value, buffer, 0, offset, valueLength);
            offset += valueLength;
            values[key] = value;
        }

        var user = new gordon.User();
        user.id = id;
        user.name = name;
        user.dataObject = this.__dataObject;
        user.dataObject.__main = this._main;
        user.dataObject.initialized = true;

        var room = this._main._structure.getRoom(roomId, true);
        room.data = JSON.parse(data);
        room.__addUser(user);
        user.room = room;

        this._main.currentRoom = room;
        this._main.me = user;
        this._main._structure.addDataObject(this.__dataObject);

        this._main.emit(gordon.Event.JOINED, null, user);
        this.__dataObject = null;
        this.__roomId = -1;
        this.__sessionId = -1;
    };

    p._in_joinError = function (view, offset) {
        var error = {};
        error.id = view.getUint8(offset);
        error.roomId = this.__roomId;
        error.sessionId = this.__sessionId;
        this._main.emit(gordon.Event.JOINED, error);
        this.__dataObject = null;
        this.__roomId = -1;
        this.__sessionId = -1;
    };

    p._in_master = function (view, offset) {
        this._main.me.master = true;
        this._main.emit(gordon.Event.JOINED, error);
    };

    p._in_userLeft = function (view, offset) {
        var buffer = view.buffer;

        var id = view.getUint16(offset);
        offset += 2;

        var sessionIdLength = view.getUint16(offset);
        offset += 2;
        var sessionId = gordon.Util.bufferToUtf8String(buffer, offset, sessionIdLength);
        offset += sessionIdLength;

        var roomIdLength = view.getUint16(offset);
        offset += 2;
        var roomId = gordon.Util.bufferToUtf8String(buffer, offset, roomIdLength);
        offset += roomIdLength;

        var room = this._main._structure.getRoom(roomId);
        var user = room.__removeUser(id);

        user.emit(gordon.User.DISPOSE, user);
        this._main.emit(gordon.Event.USER_LEFT, user);
        user.dispose();
    };

    p._in_newUser = function (view, offset) {
        var buffer = view.buffer;

        var id = view.getUint16(offset);
        offset += 2;

        var roomIdLength = view.getUint16(offset);
        offset += 2;
        var roomId = gordon.Util.bufferToUtf8String(buffer, offset, roomIdLength);
        offset += roomIdLength;

        var sessionIdLength = view.getUint16(offset);
        offset += 2;
        var sessionId = gordon.Util.bufferToUtf8String(buffer, offset, sessionIdLength);
        offset += sessionIdLength;

        var nameLength = view.getUint8(offset);
        offset++;
        var name = gordon.Util.bufferToUtf8String(buffer, offset, nameLength);
        offset += nameLength;

        var user = new gordon.User();
        user.name = name;
        user.id = id;
        var room = this._main._structure.getRoom(roomId, true);
        room.__addUser(user);
        user.room = room;

        var dataObjectId = view.getUint16(offset);
        offset += 2;

        var dataObject = new gordon.DataObject();
        dataObject.id = dataObjectId;
        dataObject.__main = this._main;
        this._main._structure.addDataObject(dataObject);
        user.dataObject = dataObject;

        var values = dataObject.values;
        var l = buffer.byteLength;
        while (offset < l) {
            var key = view.getUint16(offset);
            offset += 2;
            var valueLength = view.getUint32(offset);
            offset += 4;
            var value = new ArrayBuffer(valueLength);
            gordon.Util.copyBytes(value, buffer, 0, offset, valueLength);
            offset += valueLength;
            values[key] = value;
        }
        this._main.emit(gordon.Event.NEW_USER, user);
    };

    p._in_changeRoom = function (view, offset) {
        var me = this._main.me;

        var roomId = gordon.Util.bufferToUtf8String(view.buffer, offset);

        this._main._structure.removeRoom(me.room.id);
        var newRoom = this._main._structure.getRoom(roomId, true);
        newRoom.__addUser(me);
        me.room = newRoom;
        this._main.me.master = false;
        this._main.currentRoom = newRoom;
        this._main.emit(gordon.Event.ROOM_CHANGED, null, newRoom);
    };

    p._in_customMessage = function (view, offset) {
        var v = new DataView(view.buffer.slice(offset));
        this._main.emit(gordon.Event.CUSTOM_MESSAGE, v);
    };

    p._in_changeRoomError = function (view, offset) {
        var err = view.getUint8(offset);
        this._main.emit(gordon.Event.ROOM_CHANGED, err);
    };

    p._in_chatMessage = function (view, offset) {
        var targetId = view.getUint16(offset);
        offset += 2;
        var senderId = view.getUint16(offset);
        offset += 2;

        var sender = this._main.currentRoom.getUser(senderId);
        if (!sender) return;

        var message = gordon.Util.bufferToUtf8String(view.buffer, offset);
        if (targetId === 0) {
            this._main.emit(gordon.Event.CHAT_MESSAGE, sender, message);
        } else {
            var target = this._main.currentRoom.getUser(targetId);
            if (!target) return;
            this._main.emit(gordon.Event.PRIVATE_CHAT_MESSAGE, sender, target, message);
            target.emit(gordon.User.CHAT_MESSAGE, sender, message);
        }
    };

    p._in_dataObjectUpdate = function (view, offset) {
        var buffer = view.buffer;
        var policy = view.getUint8(offset);
        offset++;
        var id = view.getUint16(offset);
        offset += 2;

        var dataObject = this._main._structure.getDataObject(id);

        var isNew = false;

        if (!dataObject) {
            dataObject = new gordon.DataObject();
            dataObject.id = id;
            dataObject.__main = this._main;
            dataObject.initialized = true;
            dataObject.updatePolicy = policy;
            isNew = true;
            this._main._structure.addDataObject(dataObject);
        }


        if (dataObject.id == -1) return;

        var updatedKeys = [];
        var values = dataObject.values;
        var l = buffer.byteLength;
        while (offset < l) {
            var key = view.getUint16(offset);
            offset += 2;
            var valueLength = view.getUint32(offset);
            offset += 4;
            var value = new ArrayBuffer(valueLength);
            gordon.Util.copyBytes(value, buffer, 0, offset, valueLength);
            offset += valueLength;
            values[key] = value;
            updatedKeys.push(key);
        }

        dataObject.updatedKeys = updatedKeys;


        if (isNew) {
            this._main.emit(gordon.Event.NEW_DATA_OBJECT, dataObject);
        }
        else {
            dataObject.emit(gordon.DataObject.UPDATE, updatedKeys);
            this._main.emit(gordon.Event.DATA_OBJECT_UPDATE, dataObject);
        }
    };

    p._in_dataObjectCreated = function (view, offset) {
        var buffer = view.buffer;
        var callbackId = view.getUint16(offset);
        offset += 2;
        var id = view.getUint16(offset);
        offset += 2;
        var payload = this._main._structure.getCallbackObject(callbackId);
        var dataObject = payload[0];
        dataObject.__main = this._main;
        dataObject.id = id;
        dataObject.initialized = true;
        this._main._structure.addDataObject(dataObject);
        dataObject.emit(gordon.DataObject.INITIALIZED);
        if (payload[1]) payload[1].apply(null, [dataObject]);
    };

    p._in_dataObjectDeleted = function (view, offset) {
        var id = view.getUint16(offset);
        var dataObject = this._main._structure.removeDataObject(id);
        this._main.emit(gordon.Event.DATA_OBJECT_REMOVED, dataObject);
        dataObject.emit(gordon.DataObject.DISPOSE);
        dataObject.dispose();
    };

    p._in_ping = function (view, offset) {
        this.ping = Date.now() - this._pingSentTime;
        this._main.emit(gordon.Event.PING, this.ping);
    };

    p._in_getAList = function (view, offset) {
        var buffer = view.buffer;
        var callbackId = view.getUint16(offset);
        offset += 2;
        var list = gordon.Util.bufferToUtf8String(buffer, offset);
        var callback = this._main._structure.getCallbackObject(callbackId);
        callback.apply(callback, [JSON.parse(list)]);
    };



    //**********************************************************************
    //* Out		 														   *
    //**********************************************************************

    p.out_join = function (sessionId, roomId, name, dataObject, callback) {

        dataObject = dataObject || new gordon.DataObject();
        this.__roomId = roomId;
        this.__sessionId = sessionId;
        this.__dataObject = dataObject;

        name = gordon.Util.toUtf8Buffer(name);
        var nameLength = name.length;
        roomId = gordon.Util.toUtf8Buffer(roomId);
        var roomIdLength = roomId.length;
        var dataObjectSize = dataObject.getBufferSize();
        sessionId = gordon.Util.toUtf8Buffer(sessionId);
        var sessionIdLength = sessionId.length;

        var view = new DataView(this._arrayBuffer, 0, (1 + 2 + 2 + 1 + nameLength + sessionIdLength + roomIdLength + dataObjectSize));

        var offset = 0;
        view.setInt8(offset, gordon.message.JOIN);
        offset++;

        view.setUint16(offset, sessionIdLength);
        offset += 2;

        gordon.Util.writeArrayToBuffer(view, offset, sessionId);
        offset += sessionIdLength;

        view.setUint16(offset, roomIdLength);
        offset += 2;

        gordon.Util.writeArrayToBuffer(view, offset, roomId);
        offset += roomIdLength;

        view.setUint8(offset, nameLength);
        offset += 1;

        gordon.Util.writeArrayToBuffer(view, offset, name);
        offset += nameLength;

        this._encodeDataObject(view, offset, dataObject, null);

        this._main._connection.send(view, offset + dataObjectSize);
    };

    p.out_changeRoom = function (newRoomId, password, callbackId) {
        if (!newRoomId) {
            throw '[Gordon] newRoomId not defined';
        }
        password = password || '\x01';
        var dataObject = this._main.me.dataObject;
        var dataObjectSize = dataObject.getBufferSize();
        var roomId = gordon.Util.toUtf8Buffer(newRoomId);
        var roomIdLength = roomId.length;
        var pwd = gordon.Util.toUtf8Buffer(password);
        var passwordLength = pwd.length;
        var offset = 0;
        var view = new DataView(this._arrayBuffer, 0, 1 + 2 + 2 + passwordLength + roomIdLength + dataObjectSize);
        view.setUint8(offset, gordon.message.CHANGE_ROOM);
        offset++;
        view.setUint16(offset, roomIdLength);
        offset += 2;
        gordon.Util.writeArrayToBuffer(view, offset, roomId);
        offset += roomIdLength;
        gordon.Util.writeArrayToBuffer(view, offset, pwd);
        offset += passwordLength;
        this._encodeDataObject(view, offset, dataObject, null);
        this._main._connection.send(view, offset + dataObjectSize);
    };


    p.out_customMessage = function (buffer) {
        var view = new DataView(this._arrayBuffer, 0, 1 + buffer.byteLength);
        view.setUint8(0, gordon.message.CUSTOM_MESSAGE);
        gordon.Util.copyBytes(view.buffer, buffer, 1, 0);
        this._main._connection.send(view, 1 + buffer.byteLength);
    };

    p.out_chatMessage = function (targetId, message) {
        message = gordon.Util.toUtf8Buffer(message);
        var messageLength = message.length;

        var view = new DataView(this._arrayBuffer, 0, 1 + 2 + messageLength);
        var offset = 0;
        view.setUint8(offset, gordon.message.CHAT_MESSAGE);
        offset++;
        view.setUint16(offset, targetId);
        offset += 2;
        gordon.Util.writeArrayToBuffer(view, offset, message);
        this._main._connection.send(view, offset + messageLength);
    };

    p.out_ping = function () {
        var view = new DataView(this._arrayBuffer, 0, 1);
        view.setInt8(0, gordon.message.PING);
        this._pingSendTime = Date.now();
        this._main._connection.send(view, 1);
    };

    p.out_getSessionList = function (callbackId) {
        var view = new DataView(this._arrayBuffer, 0, 1 + 2);
        var offset = 0;
        view.setInt8(0, gordon.message.GET_SESSION_LIST);
        offset++;
        view.setUint16(offset, callbackId);
        offset += 2;
        this._main._connection.send(view, offset);
    };

    p.out_getRoomList = function (sessionId, callbackId) {
        sessionId = gordon.Util.toUtf8Buffer(sessionId);
        var sessionIdLength = sessionId.length;
        var view = new DataView(this._arrayBuffer, 0, 1 + 2 + 2 + sessionIdLength);
        var offset = 0;
        view.setInt8(0, gordon.message.GET_ROOM_LIST);
        offset++;

        view.setUint16(offset, callbackId);
        offset += 2;
        view.setUint16(offset, sessionIdLength);
        offset += 2;
        gordon.Util.writeArrayToBuffer(view, offset, sessionId);

        this._main._connection.send(view, offset + sessionIdLength);
    };

    p.out_getUserList = function (sessionId, roomId, callbackId) {
        sessionId = gordon.Util.toUtf8Buffer(sessionId);
        var sessionIdLength = sessionId.length;

        roomId = gordon.Util.toUtf8Buffer(roomId);
        var roomIdLength = roomId.length;

        var view = new DataView(this._arrayBuffer, 0, 1 + 2 + 2 + sessionIdLength + 2 + roomIdLength);
        var offset = 0;
        view.setInt8(0, gordon.message.GET_USER_LIST);
        offset++;

        view.setUint16(offset, callbackId);
        offset += 2;
        view.setUint16(offset, sessionIdLength);
        offset += 2;
        gordon.Util.writeArrayToBuffer(view, offset, sessionId);
        offset += sessionIdLength;

        view.setUint16(offset, roomIdLength);
        offset += 2;
        gordon.Util.writeArrayToBuffer(view, offset, roomId);
        offset += roomIdLength;

        this._main._connection.send(view, offset);
    };

    p.out_initDataObject = function (dataObject, updatePolicy, callbackId) {
        var dataObjectSize = dataObject.getBufferSize();
        var offset = 0;
        var view = new DataView(this._arrayBuffer, 0, 1 + 1 + 2 + dataObjectSize);
        view.setUint8(offset, gordon.message.INIT_DATA_OBJECT);
        offset++;
        view.setUint8(offset, updatePolicy);
        offset++;
        view.setUint16(offset, callbackId);
        offset += 2;
        this._encodeDataObject(view, offset, dataObject, null);
        this._main._connection.send(view, offset + dataObjectSize);
    };

    p.out_dataObjectUpdate = function (dataObject, broadcast) {
        if (dataObject.__updatedKeys.length === 0) return;
        var offset = 0;
        var dataObjectSize = dataObject.getBufferSize(dataObject.__updatedKeys);
        var view = new DataView(this._arrayBuffer, 0, 1 + 1 + dataObjectSize);
        view.setUint8(offset, gordon.message.DATA_OBJECT_UPDATE);
        offset++;
        view.setUint8(offset, Number(broadcast));
        offset++;
        this._encodeDataObject(view, offset, dataObject, dataObject.__updatedKeys);
        this._main._connection.send(view, offset + dataObjectSize);
        dataObject.__updatedKeys.length = 0;
    };

    p.out_deleteDataObject = function (dataObject) {
        var offset = 0;
        var view = new DataView(this._arrayBuffer, 0, 1 + 2);
        view.setUint8(offset, gordon.message.DATA_OBJECT_DELETE);
        offset++;
        view.setUint16(offset, dataObject.id);
        offset += 2;
        this._main._connection.send(view, offset);
    };

    p._encodeDataObject = function (view, offset, dataObject, keys) {
        var l;
        view.setUint16(offset, dataObject.id);
        offset += 2;
        var values = dataObject.values;
        for (var i in values) {
            if (!keys || keys.indexOf(Number(i)) != -1) {
                view.setUint16(offset, Number(i)); // key
                offset += 2;
                var value = values[i];
                var valueLength = value.byteLength;
                view.setUint32(offset, valueLength); //value length
                offset += 4;
                gordon.Util.copyBytes(view.buffer, value, offset); // value
                offset += valueLength;
            }
        }
    };

    gordon.Protocol = Protocol;

}());
