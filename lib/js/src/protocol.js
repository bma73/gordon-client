/*
 * Protocol
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
