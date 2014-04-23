package net.electronauts.gordon
{
	import flash.utils.ByteArray;
	import net.electronauts.gordon.util.Signal;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	public class DataObject
	{
		/**
		 * @private
		 */
		internal var _events:DataObjectEvents;
		/**
		 * @private
		 */
		internal var _id:int = 0;
		/**
		 * @private
		 */
		internal var _values:Array;
		/**
		 * @private
		 */
		internal var _main:GordonClient;
		/**
		 * @private
		 */
		internal var _initialized:Boolean = false;
		/**
		 * @private
		 */
		internal var _updatedKeys:Array;
		/**
		 * @private
		 */
		internal var _updatePolicy:int = 0;
		
		/**
		 * DataObject are used to synchronize states between the connected clients.
		 * Every DataObject consists of key/value pairs, where keys must be unique integers (per DataObject)
		 * and values must be ByteArrays.
		 *
		 * Every user has his own DataObject. Additional DataObjects could be created by
		 * a client or by the server.
		 *
		 * DataObjects could be used to represent objects like e.g. bots, windows, laser shots, grenades,
		 * barrels, text blocks, cars etc.
		 * 
		 * @example
		 * <listing version="3">
		 *  var sx:int = int(stage.mouseX);
		 *	var sy:int = int(stage.mouseY);
		 *	
		 *	//update the dataObject
		 *	if (_posX != sx)
		 *		_dataObject.setShort(PlayerDataKey.X_POS, sx);
		 *	if (_posY != sy)
		 *		_dataObject.setShort(PlayerDataKey.Y_POS, sy);
		 *	
		 *	_posX = sx;
		 *	_posY = sy;
		 *	
		 *	_dataObject.sendUpdates();
		 * </listing>
		 */
		public function DataObject()
		{
			_values = [];
			_updatedKeys = [];
			_events = new DataObjectEvents();
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		/**
		 * Sets the value for the specific key.
		 * @param	key
		 * @param	value
		 * @param	send Broadcast the update to all users in the user's room.
		 */
		public function setValue(key:int, value:ByteArray, send:Boolean = false):void
		{
			_values[key] = value;
			_updatedKeys.push(key);
			if (send) sendUpdates();
		}
		
		/**
		 * Gets the value of the given key.
		 * @param	key
		 * @return
		 */
		public function getValue(key:int):ByteArray
		{
			return _values[key];
		}
		
		
		public function clearUpdatedKeysList():void 
		{
			_updatedKeys.length = 0;
		}
		
		/**
		 * Sends the not yet sent updates to the server. 
		 * @param	broadcast Broadcast the updates to all users in the current room.
		 */
		public function sendUpdates(broadcast:Boolean = true):void 
		{
			if (!_initialized) return;
			var l:int = _updatedKeys.length;
			if (l == 0) return;
			_main._protocol.out_dataObjectUpdate(this, broadcast);
			_updatedKeys = [];
		}
		
		final public function setBoolean(key:int, value:Boolean, send:Boolean = false):void
		{
			getBufferForWriting(key).writeBoolean(value);
			_updatedKeys.push(key);
			if (send) sendUpdates();
		}
		
		final public function getBoolean(key:int):Boolean
		{
			return getBufferForReading(key).readBoolean();
		}
		
		final public function setByte(key:int, value:int, send:Boolean = false):void
		{
			getBufferForWriting(key).writeByte(value);
			_updatedKeys.push(key);
			if (send) sendUpdates();
		}
		
		final public function getUnsignedByte(key:int):int
		{
			return getBufferForReading(key).readUnsignedByte();
		}
		
		final public function getByte(key:int):int
		{
			return getBufferForReading(key).readByte();
		}
		
		final public function setDouble(key:int, value:Number, send:Boolean = false):void
		{
			getBufferForWriting(key).writeDouble(value);
			_updatedKeys.push(key);
			if (send) sendUpdates();
		}
		
		final public function getDouble(key:int):Number
		{
			return getBufferForReading(key).readDouble();
		}
		
		final public function setFloat(key:int, value:Number, send:Boolean = false):void
		{
			getBufferForWriting(key).writeFloat(value);
			_updatedKeys.push(key);
			if (send) sendUpdates();
		}
		
		final public function getFloat(key:int):Number
		{
			return getBufferForReading(key).readFloat();
		}
		
		final public function setUnsignedInteger(key:int, value:int, send:Boolean = false):void
		{
			getBufferForWriting(key).writeUnsignedInt(value);
			_updatedKeys.push(key);
			if (send) sendUpdates();
		}
		
		final public function getUnsignedInteger(key:int):int
		{
			return getBufferForReading(key).readUnsignedInt();
		}
		
		final public function setShort(key:int, value:int, send:Boolean = false):void
		{
			getBufferForWriting(key).writeShort(value);
			_updatedKeys.push(key);
			if (send) sendUpdates();
		}
		
		final public function getUnsignedShort(key:int):int
		{
			return getBufferForReading(key).readUnsignedShort();
		}
		
		final public function getShort(key:int):int
		{
			return getBufferForReading(key).readShort();
		}
		
		
		final public function setString(key:int, value:String, send:Boolean = false):void
		{
			getBufferForWriting(key).writeUTFBytes(value.length == 0 ? "\x01" : value);
			_updatedKeys.push(key);
			if (send) sendUpdates();
		}
		
		final public function getString(key:int):String
		{
			var buffer:ByteArray = getBufferForReading(key);
			return buffer.readUTFBytes(buffer.length);
		}
		
		final public function setObject(key:int, value:Object, send:Boolean = false):void
		{
			getBufferForWriting(key).writeUTFBytes(value == null ? "null" : JSON.stringify(value));
			_updatedKeys.push(key);
			if (send) sendUpdates();
		}
		
		final public function getObject(key:int):Object
		{
			var buffer:ByteArray = getBufferForReading(key);
			return JSON.parse(buffer.readUTFBytes(buffer.length));
		}
		
		/**
		 * Gets the DataObject events.
		 */
		final public function get events():DataObjectEvents 
		{
			return _events;
		}
		
		final public function get id():int 
		{
			return _id;
		}
		
		/**
		 * Gets the update policy for this DataObject.
		 * @see UpdatePolicy
		 */
		final public function get updatePolicy():int 
		{
			return _updatePolicy;
		}
		final public function get initialized():Boolean 
		{
			return _initialized;
		}
		
		//**********************************************************************
		//* Protected 														   *
		//**********************************************************************
	
		//**********************************************************************
		//* Private 														   *
		//**********************************************************************
		private function getBufferForWriting(key:int):ByteArray 
		{
			var buffer:ByteArray = _values[key];
			
			if (buffer == null)
			{
				buffer =_values[key] = new ByteArray();
			}
			else
			{
				buffer = _values[key] as ByteArray;
				buffer.clear();
			}
			return buffer;
		}
		
		private function getBufferForReading(key:int):ByteArray 
		{
			var buffer:ByteArray = _values[key] as ByteArray;
			buffer.position = 0;
			return buffer;
		}
		
		/**
		 * @private
		 */
		internal function dispose():void
		{
			_events._onDispose.trigger();
			if (_values != null)
			{
				for (var i:int = 0; i < _values.length; i++)
				{
					if (_values[i] != null)
						_values[i].clear();
				}
			}
			_values = null;
			_id = 0;
			_main = null;
			_events.dispose();
		}
		
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
	
	}

}