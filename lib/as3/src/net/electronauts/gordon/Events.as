package net.electronauts.gordon 
{
	import net.electronauts.gordon.util.Signal;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	internal class Events 
	{
		/**
		 * @private
		 */
		internal var _onDataObjectIds:Signal;
		/**
		 * @private
		 */
		internal var _onNewDataObject:Signal;
		/**
		 * @private
		 */
		internal var _onRemoveDataObject:Signal;
		/**
		 * @private
		 */
		internal var _onRemoveUser:Signal;
		/**
		 * @private
		 */
		internal var _onNewUser:Signal;
		/**
		 * @private
		 */
		internal var _onJoin:Signal;
		/**
		 * @private
		 */
		internal var _onJoinError:Signal;
		/**
		 * @private
		 */
		internal var _onRoomChange:Signal;
		/**
		 * @private
		 */
		internal var _onRoomChangeError:Signal;
		/**
		 * @private
		 */
		internal var _onPing:Signal;
		/**
		 * @private
		 */
		internal var _onCustomMessage:Signal;
		/**
		 * @private
		 */
		internal var _onChatMessage:Signal;
		/**
		 * @private
		 */
		internal var _onPrivateChatMessage:Signal;
		/**
		 * @private
		 */
		internal var _onSystemMessage:Signal;
		
		/**
		 * @private
		 */
		internal var _onConnect:Signal;
		/**
		 * @private
		 */
		internal var _onClose:Signal;
		/**
		 * @private
		 */
		internal var _onSecurityError:Signal;
		/**
		 * @private
		 */
		internal var _onIOError:Signal;
		
		public function Events() 
		{
			_onConnect = new Signal();
			_onClose = new Signal();
			_onSecurityError = new Signal();
			
			_onJoin = new Signal();
			_onJoinError = new Signal();
			_onNewDataObject = new Signal();
			_onRemoveDataObject = new Signal();
			_onJoinError = new Signal();
			_onRoomChange = new Signal();
			_onRoomChangeError = new Signal();
			_onNewUser = new Signal();
			_onRemoveUser = new Signal();
			_onDataObjectIds = new Signal();
			_onIOError = new Signal();
			_onPing = new Signal();
			_onCustomMessage = new Signal();
			_onChatMessage = new Signal();
			_onPrivateChatMessage = new Signal();
			_onSystemMessage = new Signal();
			
			
		}
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		
		public function get onConnect():Signal 
		{
			return _onConnect;
		}
		
		public function get onDisconnect():Signal 
		{
			return _onClose;
		}
		
		/**
		 * callbackParam: String
		 */
		public function get onSecurityError():Signal 
		{
			return _onSecurityError;
		}
		
		/**
		 * callbackParam: String
		 */
		public function get onIOError():Signal 
		{
			return _onIOError;
		}
		
		
		/**
		 * callbackParam: User
		 */
		public function get onJoin():Signal 
		{
			return _onJoin;
		}
		
		/**
		 * callbackParam: int ErrorCode
		 */
		public function get onJoinError():Signal 
		{
			return _onJoinError;
		}
		
		
		
		/**
		 * callbackParam: User
		 */
		public function get onNewUser():Signal 
		{
			return _onNewUser;
		}
		
		/**
		 * callbackParam: User
		 */
		public function get onRemoveUser():Signal 
		{
			return _onRemoveUser;
		}
		
		//public function get onDataObjectIds():Signal 
		//{
			//return _onDataObjectIds;
		//}
		
		/**
		 * callbackParam: DataObject
		 */
		public function get onNewDataObject():Signal 
		{
			return _onNewDataObject;
		}
		
		/**
		 * callbackParam: int
		 */
		public function get onPing():Signal 
		{
			return _onPing;
		}
		
		/**
		 * callbackParam: id (int)
		 */
		public function get onRemoveDataObject():Signal 
		{
			return _onRemoveDataObject;
		}
		
		/**
		 * callbackParam: ByteArray
		 */
		public function get onCustomMessage():Signal 
		{
			return _onCustomMessage;
		}
		
		/**
		 * callbackParam: Room
		 */
		public function get onChangeRoom():Signal 
		{
			return _onRoomChange;
		}
		
		/**
		 * callbackParam: int ErrorCode
		 */
		public function get onChangeRoomError():Signal 
		{
			return _onRoomChangeError;
		}
		
		/**
		 * callbackParams:	User Sender
		 * 					String Message
		 */
		public function get onChatMessage():Signal 
		{
			return _onChatMessage;
		}
		
		/**
		 * callbackParams:	String Message
		 */
		public function get onSystemMessage():Signal 
		{
			return _onSystemMessage;
		}
		
		
		/**
		 * callbackParams:	User Sender
		 * 					String Message
		 */
		public function get onPrivateChatMessage():Signal 
		{
			return _onPrivateChatMessage;
		}
		
		//**********************************************************************
		//* Protected 														   *
		//**********************************************************************
		
		//**********************************************************************
		//* Private 														   *
		//**********************************************************************
		/**
		 * @private
		 */
		internal function dispose():void 
		{
			_onClose.dispose();
			_onConnect.dispose();
			_onIOError.dispose();
			
			_onJoin.dispose();
			_onJoinError.dispose();
			_onNewUser.dispose();
			_onRemoveUser.dispose();
			_onDataObjectIds.dispose();
			_onNewDataObject.dispose();
			_onPing.dispose();
			_onCustomMessage.dispose();
			_onRoomChange.dispose();
			_onRoomChangeError.dispose();
			_onChatMessage.dispose();
			_onPrivateChatMessage.dispose();
		}
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		
		
		
	}
	
}