/*
 * Messages
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



