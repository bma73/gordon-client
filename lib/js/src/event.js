/*
 * Event
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