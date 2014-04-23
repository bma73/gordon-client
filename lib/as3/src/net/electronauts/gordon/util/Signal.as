package net.electronauts.gordon.util 
{
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	public class Signal
	{
		
		private var _queue:Vector.<Function>;
		/**
		 * A simple Signal implementation.
		 */
		public function Signal() 
		{
			_queue = new Vector.<Function>();
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		/**
		 * Adds a callback.
		 * @param	callback
		 */
		final public function add(callback:Function):void 
		{
			if (_queue.indexOf(callback) == -1) 
			{
				_queue.push(callback);
			}
		}
		
		/**
		 * Removes a callback.
		 * @param	callback
		 */
		final public function remove(callback:Function):void 
		{
			var index:int = _queue.indexOf(callback);
			if (index != -1) 
			{
				_queue.splice(index, 1);
			}
		}
		
		/**
		 * Triggers the signal.
		 * @param	...args
		 */
		final public function trigger(...args):void 
		{
			if (_queue == null) return;
			var l:int = _queue.length;
			for (var i:int = 0; i < l; i++) 
			{
				_queue[i].apply(null, args);
			}
		}
		
		public function dispose():void 
		{
			_queue = null;
		}
		
		
	}
}
