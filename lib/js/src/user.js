/*
 * User
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


