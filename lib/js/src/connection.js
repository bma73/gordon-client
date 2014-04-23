/*
 * Connection
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
