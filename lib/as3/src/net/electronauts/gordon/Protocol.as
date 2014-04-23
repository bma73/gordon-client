package net.electronauts.gordon
{
	import flash.utils.ByteArray;
	import flash.utils.getTimer;
	import net.electronauts.gordon.util.HexDump;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	
	/**
	* @private
	*/ 
	internal class Protocol
	{
		protected var _tempDataObject:DataObject;
		protected var _socketConnection:SocketConnection;
		protected var _main:GordonClient;
		protected var _sessionId:String;
		protected var _roomId:String;
		protected var _buffer1:ByteArray;
		protected var _commands:Array;
		protected var _udpatedKeys:Array;
		protected var _pingSendTime:int;
		protected var _buffer2:ByteArray;
		
		
		internal var _ping:int = -1;
		
		public function Protocol(main:GordonClient)
		{
			_main = main;
			_buffer1 = new ByteArray();
			_buffer2 = new ByteArray();
			_udpatedKeys = [];
			
			_commands = [];
			_commands[MesssageCode.JOIN] = in_join;
			_commands[MesssageCode.JOIN_ERROR] = in_joinError;
			_commands[MesssageCode.CHANGE_ROOM] = in_changeRoom;
			_commands[MesssageCode.CHANGE_ROOM_ERROR] = in_changeRoomError;
			_commands[MesssageCode.NEW_USER] = in_newUser;
			_commands[MesssageCode.USER_LEFT] = in_userLeft;
			_commands[MesssageCode.GET_SESSION_LIST] = in_getAList;
			_commands[MesssageCode.GET_ROOM_LIST] = in_getAList;
			_commands[MesssageCode.GET_USER_LIST] = in_getAList;
			_commands[MesssageCode.CUSTOM_MESSAGE] = in_customMessage;
			_commands[MesssageCode.CHAT_MESSAGE] = in_chatMessage;
			
			_commands[MesssageCode.DATA_OBJECT_CREATED] = in_dataObjectCreated;
			_commands[MesssageCode.DATA_OBJECT_UPDATE] = in_dataObjectUpdate;
			_commands[MesssageCode.DATA_OBJECT_DELETE] = in_dataObjectDeleted;
			
			_commands[MesssageCode.PING] = in_ping;
		}
		
		//**********************************************************************
		//* Internal				   										   *
		//**********************************************************************
		
		internal function reset():void
		{
		}
		
		internal function dispose():void
		{
		}
		
		internal function parse(buffer:ByteArray):void
		{
			var command:int = buffer.readUnsignedByte();
			//trace("command", command);
			//trace(HexDump.dump(buffer));
			if (_commands[command] == null)
				return;
			(_commands[command])(buffer);
		
		}
		
		//**********************************************************************
		//* Out		 														   *
		//**********************************************************************
		internal function out_join(sessionId:String, roomId:String, name:String, dataObject:DataObject):void
		{
			_tempDataObject = dataObject || new DataObject();
			if (name.length > 256)
				throw new Error("Name > 255 Chars.");
			
			_roomId = roomId;
			_sessionId = sessionId;
			
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.JOIN);
			_buffer1.writeShort(sessionId.length);
			_buffer1.writeUTFBytes(sessionId);
			_buffer1.writeShort(roomId.length);
			_buffer1.writeUTFBytes(roomId);
			_buffer1.writeByte(name.length);
			_buffer1.writeUTFBytes(name);
			
			encodeDataObjectBody(_buffer1, _tempDataObject);
			_tempDataObject.clearUpdatedKeysList();
			
			_main._connection.sendMessage(_buffer1);
		}
		
		internal function out_ping():void 
		{
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.PING);
			_pingSendTime = getTimer();
			_main._connection.sendMessage(_buffer1);
		}
		
		internal function out_deleteDataObject(dataObject:DataObject):void 
		{
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.DATA_OBJECT_DELETE);
			_buffer1.writeShort(dataObject.id);
			_main._connection.sendMessage(_buffer1);
		}
		
		internal function out_initDataObject(dataObject:DataObject, updatePolicy:int, callbackId:int):void 
		{
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.INIT_DATA_OBJECT);
			_buffer1.writeByte(updatePolicy);
			_buffer1.writeShort(callbackId);
			encodeDataObjectBody(_buffer1, dataObject, dataObject._updatedKeys);
			_main._connection.sendMessage(_buffer1);
		}
		
		internal function out_dataObjectUpdate(dataObject:DataObject, broadcast:Boolean = true):void
		{
			if (dataObject._updatedKeys.length == 0) return;
			
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.DATA_OBJECT_UPDATE);
			_buffer1.writeByte(Number(broadcast));
			//_buffer1.writeShort(callbackId);
			encodeDataObjectBody(_buffer1, dataObject, dataObject._updatedKeys);
			_main._connection.sendMessage(_buffer1);
		}
		
		internal function out_getSessionList(callbackId:int):void
		{
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.GET_SESSION_LIST);
			_buffer1.writeShort(callbackId);
			_main._connection.sendMessage(_buffer1);
		}
		
		internal function out_getRoomList(sessionId:String, callbackId:int):void
		{
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.GET_ROOM_LIST);
			_buffer1.writeShort(callbackId);
			_buffer1.writeShort(sessionId.length);
			_buffer1.writeUTFBytes(sessionId);
			_main._connection.sendMessage(_buffer1);
		}
		
		internal function out_getUserList(sessionId:String, roomId:String, callbackId:int):void
		{
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.GET_USER_LIST);
			_buffer1.writeShort(callbackId);
			_buffer1.writeShort(sessionId.length);
			_buffer1.writeUTFBytes(sessionId);
			_buffer1.writeShort(roomId.length);
			_buffer1.writeUTFBytes(roomId);
			_main._connection.sendMessage(_buffer1);
		}
		
		internal function out_changeRoom(newRoomId:String, password:String = ""):void 
		{
			if (password == "") password = "\x01";
			var dataObject:DataObject = _main._structure._me._dataObject;
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.CHANGE_ROOM);
			_buffer1.writeShort(newRoomId.length);
			_buffer1.writeUTFBytes(newRoomId);
			_buffer1.writeShort(password.length);
			_buffer1.writeUTFBytes(password);
			
			
			var l:int = password.length;
			var dstart:int = _buffer1.position;
			encodeDataObjectBody(_buffer1, dataObject);
			dataObject.clearUpdatedKeysList();
			
			_main._connection.sendMessage(_buffer1);
		}
		
		internal function out_chat(message:String, targetUserId:int = 0):void 
		{
			if (message.length == 0) return;
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.CHAT_MESSAGE);
			_buffer1.writeShort(targetUserId);
			_buffer1.writeUTFBytes(message);
			_main._connection.sendMessage(_buffer1);
		}
		
		internal function out_customMessage(message:ByteArray):void 
		{
			if (message.length == 0) return;
			_buffer1.clear();
			_buffer1.writeByte(MesssageCode.CUSTOM_MESSAGE);
			_buffer1.writeBytes(message);
			_main._connection.sendMessage(_buffer1);
		}
		
		//**********************************************************************
		//* In		 														   *
		//**********************************************************************
		internal function in_join(buffer:ByteArray):void
		{
			var id:int = buffer.readUnsignedShort();
			var sessionIdLength:int = buffer.readUnsignedShort();
			var sessionId:String = buffer.readUTFBytes(sessionIdLength);
			
			var roomIdLength:int = buffer.readUnsignedShort();
			var roomId:String = buffer.readUTFBytes(roomIdLength);
			
			var dataLength:int = buffer.readUnsignedShort();
			var data:String = buffer.readUTFBytes(dataLength);
			
			_tempDataObject._id = buffer.readUnsignedShort();
			_tempDataObject._main = _main;
			
			var name:String = buffer.readUTFBytes(buffer.readShort());
			
			//key/value
			var values:Array = _tempDataObject._values;
			
			//key/values
			while (buffer.bytesAvailable)
			{
				var key:int = buffer.readUnsignedShort();
				var valueLength:int = buffer.readUnsignedInt();
				var value:ByteArray = values[key] as ByteArray;
				
				if (value == null) value = new ByteArray();
				
				buffer.readBytes(value, 0,  valueLength);
				_tempDataObject._values[key] = value;
			}
			
			var user:User = new User(id);
			var room:Room = _main._structure.getRoom(roomId, true);
			room._data = JSON.parse(data);
			
			user._name = name;
			user._main = _main;
			user._room = room;
			user._dataObject = _tempDataObject;
			user._dataObject._initialized = true;
			
			room.addUser(user);
			
			_main._structure._currentRoom = room;
			_main._structure._me = user;
			_main._structure.addDataObject(_tempDataObject);
			
			_main._events._onJoin.trigger(user);
			_tempDataObject = null;
		}
		internal function in_joinError(buffer:ByteArray):void
		{
			var error:int = buffer.readByte();
			_main._events._onJoinError.trigger(error);
		}
		
		internal function in_newUser(buffer:ByteArray):void 
		{
			var id:int = buffer.readUnsignedShort();
			
			var roomIdLength:int = buffer.readUnsignedShort();
			var roomId:String = buffer.readUTFBytes(roomIdLength);
			
			var sessionIdLength:int = buffer.readUnsignedShort();
			var sessionId:String = buffer.readUTFBytes(sessionIdLength);
			
			
			var nameLength:int = buffer.readByte();
			var name:String = buffer.readUTFBytes(nameLength);
			
			var user:User = new User(id);
			user._name = name;
			var room:Room = _main._structure.getRoom(roomId);
			room.addUser(user);
			user._room = room;
			
			var dataObject:DataObject = new DataObject();
			
			dataObject._id = buffer.readShort();
			
			user._main = dataObject._main = _main;
			
			_main._structure.addDataObject(dataObject);
			user._dataObject = dataObject;
			
			//key/values
			while (buffer.bytesAvailable)
			{
				var key:int = buffer.readUnsignedShort();
				var valueLength:int = buffer.readUnsignedInt();
				var value:ByteArray = new ByteArray();
				buffer.readBytes(value, 0,  valueLength);
				dataObject._values[key] = value;
			}
			dataObject._updatedKeys.length = 0;
			_main._events._onNewUser.trigger(user);
		}
		
		protected function in_dataObjectCreated(buffer:ByteArray):void 
		{
			var callbackId:int = buffer.readUnsignedShort();
			var id:int = buffer.readUnsignedShort();
			var payload:Array = _main._structure.getCallbackObject(callbackId) as Array;
			var dataObject:DataObject = payload[0] as DataObject;
			dataObject._main = _main;
			dataObject._id = id;
			dataObject._initialized = true;
			_main._structure.addDataObject(dataObject);
			dataObject._events._onInitialized.trigger();
			if (payload[1] != null) payload[1](dataObject);
		}
		
		protected function in_dataObjectDeleted(buffer:ByteArray):void 
		{
			var id:int = buffer.readUnsignedShort();
			var dataObject:DataObject = _main._structure.removeDataObject(id) as DataObject;
			dataObject.dispose();
			_main.events._onRemoveDataObject.trigger(id);
		}
		
		protected function in_dataObjectUpdate(buffer:ByteArray):void 
		{
			var policy:int = buffer.readByte();
			var id:int = buffer.readUnsignedShort();
			var dataObject:DataObject = _main._structure._dataObjects[id] as DataObject;
			var isNew:Boolean = false;
			if (dataObject == null)
			{
				dataObject = new DataObject();
				dataObject._id = id;
				dataObject._main = _main;
				isNew = true;
				dataObject._initialized = true;
				dataObject._updatePolicy = policy;
				_main._structure.addDataObject(dataObject);
			}
			
			if (dataObject.id == -1) return;
			var values:Array = dataObject._values;
			var updatedKeys:Array = [];
			
			//key/values
			while (buffer.bytesAvailable)
			{
				var key:int = buffer.readUnsignedShort();
				var valueLength:int = buffer.readUnsignedInt();
				var value:ByteArray = values[key] as ByteArray;
				
				if (value == null) value = new ByteArray();
				
				buffer.readBytes(value, 0,  valueLength);
				dataObject._values[key] = value;
				updatedKeys.push(key);
			}
			if (isNew)
			{
				_main._events._onNewDataObject.trigger(dataObject);
			}
			else
			{
				dataObject._events._onUpdate.trigger(updatedKeys);
			}
		}
		
		protected function in_userLeft(buffer:ByteArray):void 
		{
			var id:int = buffer.readShort();
			var sessionIdLength:int = buffer.readShort();
			var sessionId:String = buffer.readUTFBytes(sessionIdLength);
			var roomIdLength:int = buffer.readShort();
			var roomId:String = buffer.readUTFBytes(roomIdLength);
			var room:Room = _main._structure.getRoom(roomId);
			var user:User = room.removeUser(id);
			user._events._onRemove.trigger();
			_main._events._onRemoveUser.trigger(user);
			user.dispose(); 
		}
		
		protected function in_getAList(buffer:ByteArray):void 
		{
			var callbackId:int = buffer.readShort();
			var json:String = buffer.readUTFBytes(buffer.bytesAvailable);
			var obj:Array = JSON.parse(json) as Array;
			var callback:Function = _main._structure.getCallbackObject(callbackId) as Function;
			if (callback != null) callback(obj);
		}
		
		internal function in_ping(buffer:ByteArray):void 
		{
			_ping = getTimer() - _pingSendTime;
			_main._events._onPing.trigger(_ping);
		}
		
		protected function in_customMessage(buffer:ByteArray):void 
		{
			var b:ByteArray = new ByteArray();
			b.writeBytes(buffer, 1);
			b.position = 0;
			_main._events._onCustomMessage.trigger(b);
		}
		
		internal function in_changeRoom(buffer:ByteArray):void
		{
			var roomId:String = buffer.readUTFBytes(buffer.bytesAvailable);
			var me:User = _main._structure._me;
			_main._structure.removeRoom(me._room._id);
			var newRoom:Room = _main._structure.getRoom(roomId, true);
			newRoom.addUser(me);
			me._room = newRoom;
			_main._structure._currentRoom = newRoom;
			_main._events._onRoomChange.trigger(newRoom);
		}
		
		internal function in_changeRoomError(buffer:ByteArray):void
		{
			var error:int = buffer.readUnsignedByte();
			_main._events._onRoomChangeError.trigger(error);
		}
		
		internal function in_chatMessage(buffer:ByteArray):void
		{
			var targetId:int = buffer.readShort();
			var senderId:int = buffer.readShort();
			var sender:User = _main._structure._currentRoom.getUser(senderId);
			if (sender == null) return;
			
			var message:String = buffer.readUTFBytes(buffer.bytesAvailable);
			
			if (targetId == 0)
			{
				_main._events.onChatMessage.trigger(sender, message);
			}
			else
			{
				var target:User = _main._structure._currentRoom.getUser(targetId);
				if (target == null) return;
				target._events._onChatMessage.trigger(sender, message);
				_main._events._onPrivateChatMessage.trigger(sender, message);
			}
		}
		
		//**********************************************************************
		//* Private 														   *
		//**********************************************************************
	
		private function encodeDataObjectBody(buffer:ByteArray, dataObject:DataObject, keys:Array = null):void
		{
			var l:int;
			buffer.writeShort(dataObject._id);
			var values:Array = dataObject._values;
			if (keys == null)
			{
				l = values.length;
				for (var i:int = 0; i < l; i++)
				{
					var value:ByteArray = values[int(i)] as ByteArray;
					buffer.writeShort(i);
					buffer.writeUnsignedInt(value.length);
					buffer.writeBytes(value);
				}
			}
			else
			{
				l = keys.length;
				for (i = 0; i < l; i++)
				{
					var keyId:int = int(keys[i]);
					value = values[int(keyId)] as ByteArray;
					buffer.writeShort(keyId);
					buffer.writeUnsignedInt(value.length);
					buffer.writeBytes(value);
				}
			}
		}
	
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
	
	}

}