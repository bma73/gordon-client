/*
 * Structure
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


