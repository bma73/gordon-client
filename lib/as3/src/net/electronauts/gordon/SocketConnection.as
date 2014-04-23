package net.electronauts.gordon
{
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;
	import flash.net.Socket;
	import flash.utils.ByteArray;
	import net.electronauts.gordon.util.HexDump;
	
	/**
	 * ...
	 * @author BMA | www.electronauts.net
	 */
	
	internal class SocketConnection
	{
		protected var _buffer3:ByteArray;
		/**
		 * @private
		 */
		internal var _protocol:Protocol;
		/**
		 * @private
		 */
		internal var _socket:Socket;
		/**
		 * @private
		 */
		internal var _host:String;
		/**
		 * @private
		 */
		internal var _port:int;
		/**
		 * @private
		 */
		internal var _connectionState:String;
		
		private var _main:GordonClient;
		private var _buffer1:ByteArray;
		private var _buffer2:ByteArray;
		
		public function SocketConnection(main:GordonClient)
		{
			_main = main;
			
			_socket = new Socket();
			_buffer1 = new ByteArray();
			_buffer2 = new ByteArray();
			_buffer3 = new ByteArray();
			
			_socket.addEventListener(Event.CONNECT, onConnect);
			_socket.addEventListener(IOErrorEvent.IO_ERROR, onIOError);
			_socket.addEventListener(Event.CLOSE, onClose);
			_socket.addEventListener(ProgressEvent.SOCKET_DATA, onData);
			_socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onSecurityError);
			
			_connectionState = ConnectionState.DISCONNECTED;
		}
		
		//**********************************************************************
		//* Internal				   										   *
		//**********************************************************************
		/**
		 * @private
		 */
		internal function connect(host:String, port:int):void
		{
			_socket.connect(host, port);
			_port = port;
			_host = host;
			_connectionState = ConnectionState.CONNECTING;
		}
		
		/**
		 * @private
		 */
		internal function close():void
		{
			_socket.close();
			_connectionState = ConnectionState.DISCONNECTED;
		}
		
		/**
		 * @private
		 */
		internal function join(sessionId:int, roomId:int):void
		{
			_connectionState = ConnectionState.JOINED;
		}
		
		/**
		 * @private
		 */
		internal function sendMessage(message:ByteArray):void
		{
			if (_connectionState == ConnectionState.DISCONNECTED)
				return;
			
			//trace("out");
			//trace(HexDump.dump(message));
			_socket.writeUnsignedInt(message.length);
			_socket.writeBytes(message);
			_socket.flush();
		}
		
		/**
		 * @private
		 */
		internal function disconnect():void
		{
			close();
		}
		
		/**
		 * @private
		 */
		internal function dispose():void
		{
			close();
			_protocol.dispose();
			_socket = null;
			_buffer1.clear();
			_buffer2.clear();
			
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
		private function onData(e:ProgressEvent):void 
		{
			_socket.readBytes(_buffer1, _buffer1.length, _socket.bytesAvailable);
			var bufferLength:int = _buffer1.length;
			var position:int = _buffer1.position;
			while (bufferLength >= 4)
			{
				var messageLength:int = _buffer1.readUnsignedInt();
				if (bufferLength - 4 >= messageLength)
				{
					_buffer2.clear();
					_buffer2.writeBytes(_buffer1, _buffer1.position, messageLength);
					_buffer2.position = 0;
					_main._protocol.parse(_buffer2);
					_buffer3.clear();
					_buffer3.writeBytes(_buffer1, _buffer1.position + messageLength);
					_buffer1.clear();
					_buffer1.writeBytes(_buffer3);
					_buffer1.position = 0;
				}
				else 
				{
					_buffer1.position = position;
					break;
				}
				bufferLength = _buffer1.length;
			}
		}
		
		private function onClose(e:Event):void
		{
			_connectionState = ConnectionState.DISCONNECTED;
			_main._events._onClose.trigger();
		}
		
		private function onIOError(e:IOErrorEvent):void
		{
			_connectionState = ConnectionState.DISCONNECTED;
			_main._events._onIOError.trigger(e.text);
		}
		
		private function onConnect(e:Event):void
		{
			_connectionState = ConnectionState.CONNECTED;
			_main._events._onConnect.trigger();
		
		}
		
		private function onSecurityError(e:SecurityErrorEvent):void
		{
			_connectionState = ConnectionState.DISCONNECTED;
			_main._events._onSecurityError.trigger(e.text);
		}
	}
}