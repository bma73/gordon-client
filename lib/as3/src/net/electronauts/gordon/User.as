package net.electronauts.gordon
{
	import flash.utils.ByteArray;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	public class User
	{
		/**
		 * @private
		 */
		internal var _main:GordonClient;
		/**
		 * @private
		 */
		internal var _room:Room;
		/**
		 * @private
		 */
		internal var _id:int = 1;
		/**
		 * @private
		 */
		internal var _name:String;
		/**
		 * @private
		 */
		internal var _dataObject:DataObject;
		/**
		 * @private
		 */
		internal var _events:UserEvents;
		
		/**
		 * Every client connected to the Gordon Server and joined to a session is represented as a user.
		 * Users can interact with each other by updating their DataObjects, sending chat or custom messages.
		 *
		 * @param	id
		 * @see DataObject
		 * @see GordonClient#sendChatMessage
		 * @see GordonClient#sendCustomMessage
		 */
		public function User(id:int)
		{
			_id = id;
			_events = new UserEvents();
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		/**
		 * The user's room.
		 */
		public function get room():Room
		{
			return _room;
		}
		
		public function get dataObject():DataObject
		{
			return _dataObject;
		}
		
		public function get id():int
		{
			return _id;
		}
		
		public function get name():String
		{
			return _name;
		}
		
		/**
		 * The user events.
		 */
		public function get events():UserEvents
		{
			return _events;
		}
		
		/**
		 * @private
		 */
		internal function dispose():void
		{
			_dataObject.dispose();
			_events.dispose();
			_room = null;
			_main = null;
		}
	
	}

}