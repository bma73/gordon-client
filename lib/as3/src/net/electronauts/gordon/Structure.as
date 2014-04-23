package net.electronauts.gordon 
{
	import net.electronauts.gordon.util.AdvancedDictionary;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	
	/**
	 * @private
	 */ 
	internal class Structure 
	{
		private var _main:GordonClient;
		
		internal var _currentRoom:Room;
		internal var _me:User;
		
		internal var _rooms:AdvancedDictionary;
		internal var _dataObjects:AdvancedDictionary;
		
		internal var _callbackId:int = 1;
		internal var _callbackPool:AdvancedDictionary;
		
		
		public function Structure(main:GordonClient) 
		{
			_main = main;
			_rooms = new AdvancedDictionary();
			_dataObjects = new AdvancedDictionary();
			_callbackPool = new AdvancedDictionary();
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		
		//**********************************************************************
		//* Protected 														   *
		//**********************************************************************
		internal function dispose():void 
		{
			_dataObjects.dispose(true);
			_callbackPool.dispose();
			_rooms.dispose();
		}
		
		internal function getRoom(roomId:String, autoAdd:Boolean = false):Room 
		{
			var room:Room = _rooms[roomId] as Room;
			if (room == null)
			{
				if (autoAdd)
				{
					room = addRoom(roomId);
				}
			}
			return room;
		}
		
		internal function addUser(id:int):User
		{
			var user:User = new User(id);
			user._id = id;
			return user;
		}
		
		internal function addDataObject(dataObject:DataObject):void
		{
			_dataObjects.put(dataObject._id, dataObject);
		}
		
		internal function removeDataObject(id:int):DataObject
		{
			return _dataObjects.remove(id) as DataObject;
		}
		
		internal function addRoom(roomId:String):Room 
		{
			var room:Room = new Room();
			room._id = roomId;
			room._main = _main;
			_rooms.put(roomId, room);
			return room;
		}
		
		internal function removeRoom(roomId:String):Room
		{
			var room:Room = _rooms.remove(roomId);
			room.dispose();
			return room;
		}
		
		internal function initDataObject(dataObject:DataObject, callback:Function = null):int 
		{
			var id:int = _callbackId++;
			if (_callbackId > 0xffff) _callbackId = 1;
			_callbackPool.put(id, [dataObject, callback] );
			return id;
		}
		
		internal function putCallbackObject(object:*):int
		{
			var id:int = _callbackId++;
			if (_callbackId > 0xffff) _callbackId = 1;
			_callbackPool.put(id, object);
			return id;
		}
		
		internal function getCallbackObject(id:int):*
		{
			return _callbackPool.remove(id);
		}
		
		//**********************************************************************
		//* Private 														   *
		//**********************************************************************
		
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		
	}
	
}