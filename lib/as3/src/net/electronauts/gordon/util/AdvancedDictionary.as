package net.electronauts.gordon.util
{
	import flash.utils.Dictionary;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	dynamic public class AdvancedDictionary extends Dictionary
	{
		
		private var _length:int = 0;
		private var _weakKeys:Boolean;
		
		/**
		 * An advanced version of the built-in Dictionary class.
		 * @param	weakKeys
		 * @param	initData
		 */
		public function AdvancedDictionary(weakKeys:Boolean = false, initData:Object = null)
		{
			super(weakKeys);
			_weakKeys = weakKeys;
			if (initData != null)
			{
				for (var key:* in initData)
				{
					this[key] = initData[key];
				}
			}
		}
		
		//**********************************************************************
		//* Public 					   										   *
		//**********************************************************************
		/**
		 * Adds or replaces a key/value
		 * @param	key
		 * @param	value
		 * @return value
		 */
		final public function put(key:*, value:*):*
		{
			if (this[key] == null)
				_length++;
			this[key] = value;
			return value;
		}
		
		/**
		 * 
		 * @param	key
		 * @param	disposeValue If set to true, the value's "dispose" method will be triggered if available
		 * @return
		 */
		final public function remove(key:*, disposeValue:Boolean = false):*
		{
			if (this[key] != null)
				_length--;
			var value:* = this[key];
			if (disposeValue)
			{
				if (value["dispose"] != null) value["dispose"]();
			}
			this[key] = null;
			delete this[key];
			return value;
		}
		
		/**
		 * Clear all key/values.
		 */
		final public function dispose(disposeValues:Boolean = false ):void
		{
			for (var key:* in this)
			{
				remove(key, disposeValues);
			}
			_length = 0;
		}
		
		/**
		 * Get the number of entries.
		 */
		final public function get length():int
		{
			return _length;
		}
		
		/**
		 * Returns all values as an array.
		 * @return
		 */
		final public function valuesToArray():Array
		{
			var ret:Array = [];
			var value:*;
			for each (value in this)
			{
				ret.push(value);
			}
			return ret;
		}
		
		final public function forEach(callback:Function, thisObject:* = null, ... args):void
		{
			
			for each (var i:*in this)
			{
				var a:Array = [i];
				if (args.length > 0)
				{
					a = a.concat(args);
				}
				callback.apply(thisObject, a);
			}
		}
		
		final public function hasKey(key:*):Boolean
		{
			return this[key] != null;
		}
		
		final public function keysToArray():Array
		{
			var ret:Array = [];
			var key:*;
			for (key in this)
			{
				ret.push(key);
			}
			return ret;
		}
		
		final public function dump(info:String = ""):void
		{
			if (info != "")
				trace(info);
			trace(dumpToString());
		}
		
		final public function dumpToString():String
		{
			var out:String = "";
			for (var i:String in this)
			{
				out += i + " : " + this[i] + "\n";
			}
			return out;
		}
		
		final public function clone():AdvancedDictionary
		{
			var a:AdvancedDictionary = new AdvancedDictionary(_weakKeys);
			for (var i:String in this)
			{
				a.put(i, this[i]);
			}
			return a;
		}
	}
}