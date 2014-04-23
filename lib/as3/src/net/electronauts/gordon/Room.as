package net.electronauts.gordon 
{
	import net.electronauts.gordon.util.AdvancedDictionary;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	public class Room 
	{
		/**
		 * @private
		 */
		internal var _events:RoomEvents;
		/**
		 * @private
		 */
		internal var _users:AdvancedDictionary;
		/**
		 * @private
		 */
		internal var _dataObjects:AdvancedDictionary;
		/**
		 * @private
		 */
		internal var _id:String = "";
		/**
		 * @private
		 */
		internal var _main:GordonClient;
		/**
		 * @private
		 */
		internal var _data:Object;
		
		/**
		 * A Room instance stores information about the current room.
		 * Users and DataObjects are grouped in a room.
		 */
		public function Room() 
		{
			_users = new AdvancedDictionary();
			_dataObjects = new AdvancedDictionary();
			_events = new RoomEvents();
		}
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		/**
		 * The room id.
		 */
		public function get id():String 
		{
			return _id;
		}
		
		/**
		 * The list of users.
		 */
		public function get users():AdvancedDictionary 
		{
			return _users;
		}
		/**
		 * The room events.
		 */
		public function get events():RoomEvents 
		{
			return _events;
		}
		
		/**
		 * Adds a DataObject to the current room. This is an async command.
		 * The provided callback will triggered.
		 * @param	dataObject The DataObject
		 * @param	updatePolicy @see UpdatePolicy
		 * @param	callback The initialized DataObject is passed to the callback. 
		 * @return 
		 */
		public function addDataObject(dataObject:DataObject, updatePolicy:int = 0, callback:Function = null ):DataObject 
		{
			var id:int = _main._structure.initDataObject(dataObject, callback);
			_main._protocol.out_initDataObject(dataObject, updatePolicy, id);
			return dataObject;
		}
		
		/**
		 * Deletes a dataObject
		 * @param	dataObject
		 * @return 
		 */
		public function removeDataObject(dataObject:DataObject):DataObject 
		{
			_main._protocol.out_deleteDataObject(dataObject);
			return dataObject;
		}
		/**
		 * Gets all dataObjects in this room.
		 */
		public function get dataObjects():Array 
		{
			return _dataObjects.valuesToArray();
		}
		
		//**********************************************************************
		//* Protected 														   *
		//**********************************************************************
		/**
		 * @private
		 */
		internal function dispose():void 
		{
			_main = null;
			_users.dispose();
			_dataObjects.dispose();
		}
		/**
		 * @private
		 */
		internal function addUser(user:User):void 
		{
			_users.put(user._id, user);
			user._room = this;
		}
		/**
		 * @private
		 */
		internal function getUser(id:int):User
		{
			return _users[id] as User;
		}
		/**
		 * @private
		 */
		internal function removeUser(id:int):User 
		{
			return _users.remove(id) as User;
		}
	}
}