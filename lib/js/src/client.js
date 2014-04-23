/*
 * Gordon Client
 * Copyright (c) 2014 Björn Acker | http://www.bjoernacker.de
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

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


