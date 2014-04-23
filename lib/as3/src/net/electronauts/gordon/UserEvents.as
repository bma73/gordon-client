package net.electronauts.gordon 
{
	import net.electronauts.gordon.util.Signal;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	internal class UserEvents 
	{
		/**
		 * @private
		 */
		internal var _onRemove:Signal;
		/**
		 * @private
		 */
		internal var _onChatMessage:Signal;
		
		public function UserEvents() 
		{
			_onRemove = new Signal();
			_onChatMessage = new Signal();
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		public function dispose():void 
		{
			_onRemove.dispose();
			_onChatMessage.dispose();
		}
		
		final public function get onRemove():Signal 
		{
			return _onRemove;
		}
		/**
		 * callback params: sender (User), message (String)
		 */
		public function get onChatMessage():Signal 
		{
			return _onChatMessage;
		}
	}
}