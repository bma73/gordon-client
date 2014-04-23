/*
 * ErrorCode
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
 * Error codes sent by the server.
 *
 * @module gordon
 */

this.gordon = this.gordon || {};

/**
 * Codes
 *
 * @class Codes
 * @static
 */

gordon.Codes = {

    /**
     *@property {Number} ERROR_SERVER_FULL
     *@final
     */
    ERROR_SERVER_FULL: 0,

    /**
     *@property {Number} ERROR_ROOM_FULL
     *@final
     */
    ERROR_ROOM_FULL: 1,

    /**
     *@property {Number} ERROR_SESSION_DOES_NOT_EXIST
     *@final
     */
    ERROR_SESSION_DOES_NOT_EXIST: 2,

    /**
     *@property {Number} ERROR_ROOM_DOES_NOT_EXIST
     *@final
     */
    ERROR_ROOM_DOES_NOT_EXIST: 3,

    /**
     *@property {Number} ERROR_WRONG_PASSWORD
     *@final
     */
    ERROR_WRONG_PASSWORD: 4,

    /**
     *@property {Number} ERROR_MISC
     *@final
     */
    ERROR_MISC: 5,

    /**
     * Sent if the user tries to change in the same room in which he is currently in.
     *@property {Number} ERROR_SAME_ROOM
     *@final
     */
    ERROR_SAME_ROOM: 6,

    /**
     * Only the dataObject's creator is allowed to update it.
     *@property {Number} UPDATE_POLICY_PRIVATE
     *@final
     */
    UPDATE_POLICY_PRIVATE: 0,

    /**
     * All users are allowed to update the dataObject.
     *@property {Number} UPDATE_POLICY_PUPLIC
     *@final
     */
    UPDATE_POLICY_PUPLIC: 1

};
