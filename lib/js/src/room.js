/*
 * Room
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


