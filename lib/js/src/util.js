/*
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

