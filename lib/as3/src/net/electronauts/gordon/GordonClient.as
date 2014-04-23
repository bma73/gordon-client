package net.electronauts.gordon 
{
	import flash.utils.ByteArray;
	import flash.utils.clearInterval;
	import flash.utils.setInterval;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	public class GordonClient	
	{
		protected var _pingInv:int;
		protected var _pingInterval:int;
		/**
		 * @private
		 */
		internal var _structure:Structure;
		/**
		 * @private
		 */
		internal var _protocol:Protocol;
		/**
		 * @private
		 */
		internal var _connection:SocketConnection;
		/**
		 * @private
		 */
		internal var _events:Events;
		
		/**
		 * The Gordon Client Class
		 * @param	pingInterval Sets the interval in milliseconds. The default value is 10000.
		 * The server uses the client pings to check if the current connection is still valid.
		 */
		public function GordonClient(pingInterval:int = 10000) 
		{
			_pingInterval = pingInterval;
			_events = new Events();
			_connection = new SocketConnection(this);
			_protocol = new Protocol(this);
			_structure = new Structure(this);
			this.pingInterval = pingInterval;
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		/**
		 * Connects the client to the server
		 * @param	host 
		 * @param	port
		 */
		public function connect(host:String, port:int):void 
		{
			_connection.connect(host, port);
		}
		
		/**
		 * Joins a session and room
		 * @param	sessionUuid The unique session id.
		 * @param	roomUuid The unique room id.
		 * @param	name The users nickname.
		 * @param	dataObject An optional DataObject
		 */
		
		public function join(sessionUuid:String, roomUuid:String, name:String, dataObject:DataObject=null):void 
		{
			_protocol.out_join(sessionUuid, roomUuid, name, dataObject);
		}
		
		 /**
		  * Gets the session list from the server
		  * @param	callback An array with session objects will be passed to the callback function. 
		  */
		public function getSessionList(callback:Function):void 
		{
			var id:int = _structure.putCallbackObject(callback);
			_protocol.out_getSessionList(id);
		}
		
		/**
		 * Gets the list of rooms for the provided session id from the server.
		 * @param	sessionId
		 * @param	callback An array of room objects will be passed to the callback function.
		 */
		public function getRoomList(sessionId:String, callback:Function):void 
		{
			var id:int = _structure.putCallbackObject(callback);
			_protocol.out_getRoomList(sessionId, id);
		}
		
		/**
		 * Gets the list of user for the provided session id and room id from the server.
		 * @param	sessionId
		 * @param	roomId
		 * @param	callback An array of user objects will be passed to the callback function.
		 */
		
		public function getUserList(sessionId:String, roomId:String, callback:Function):void 
		{
			var id:int = _structure.putCallbackObject(callback);
			_protocol.out_getUserList(sessionId, roomId, id);
		}
		
		/**
		 * Change to a new room.
		 * @param	newRoomId
		 * @param	password Use this password to join, if the new room is locked by a password.
		 */
		public function changeRoom(newRoomId:String, password:String = ""):void 
		{
			_protocol.out_changeRoom(newRoomId, password);
		}
		
		/**
		 * Disposes the client.
		 */
		public function dispose():void 
		{
			_connection.dispose();
			_protocol.dispose();
			_events.dispose();
			_structure.dispose();
			clearInterval(_pingInv);
		}
		
		/**
		 * Sends a binary custom message to the server.
		 * @example The following code sets the volume level for your sound:
		 * <listing version="3">
		 * var buffer:ByteArray = new ByteArray();
		 * buffer.writeByte(8);
		 * buffer.writeShort(999);
		 * gordon.sendCustomMessage(buffer);
		 * </listing>
		 * @param	buffer
		 */
		
		public function sendCustomMessage(buffer:ByteArray):void 
		{
			_protocol.out_customMessage(buffer);
		}
		
		/**
		 * Sends a text chat message to the all users or a specific user in the current room. 
		 * @param	message The text message.
		 * @param	userId The target user id. If 0 is passed, all users in the room will receive the message.
		 */
		public function sendChatMessage(message:String, userId:int = 0):void 
		{
			_protocol.out_chat(message, userId);
		}
		
		/**
		 * Gets all dataObjects.
		 */
		public function get dataObjects():Array
		{
			return _structure._dataObjects.valuesToArray();
		}
		
		/**
		 * The client events.
		 */
		public function get events():Events 
		{
			return _events;
		}
		
		/**
		 * My user.
		 */
		public function get me():User
		{
			return _structure._me;
		}
		
		/**
		 * My current room.
		 */
		public function get currentRoom():Room
		{
			return _structure._currentRoom;
		}
		
		/**
		 * The current ping.
		 */
		public function get ping():int
		{
			return _protocol._ping;
		}
		
		/**
		 * Gets/sets the ping interval.
		 * The server uses the client pings to check if the current connection is still valid.
		 */
		public function get pingInterval():int 
		{
			return _pingInterval;
		}
		
		public function set pingInterval(value:int):void 
		{
			_pingInterval = value;
			clearInterval(_pingInv);
			_pingInv = setInterval(_protocol.out_ping, pingInterval);
		}
		
	}
	
}