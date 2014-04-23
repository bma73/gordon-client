package net.electronauts.gordon 
{
	import net.electronauts.gordon.util.Signal;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	internal class DataObjectEvents 
	{
		/**
		 * @private
		 */
		internal var _onInitialized:Signal;
		/**
		 * @private
		 */
		internal var _onUpdate:Signal;
		/**
		 * @private
		 */
		internal var _onDispose:Signal
		
		public function DataObjectEvents() 
		{
			_onInitialized = new Signal();
			_onUpdate = new Signal();
			_onDispose = new Signal();
		}
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		final public function get onInitialized():Signal 
		{
			return _onInitialized;
		}
		
		/**
		 * Callback params: Array (updated keys) 
		 */
		final public function get onUpdate():Signal 
		{
			return _onUpdate;
		}
		
		public function get onDispose():Signal 
		{
			return _onDispose;
		}
		
		//**********************************************************************
		//* Protected 														   *
		//**********************************************************************
		
		//**********************************************************************
		//* Private 														   *
		//**********************************************************************
		
		//**********************************************************************
		//* Event 															   *
		//**********************************************************************
		internal function dispose():void 
		{
			_onInitialized.dispose();
			_onUpdate.dispose();
			_onDispose.dispose();
		}
		
	}
	
}