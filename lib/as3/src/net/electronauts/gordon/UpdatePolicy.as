package net.electronauts.gordon 
{
	
	/**
	 * ...
	 * @author Bjoern Acker | www.gface.com
	 */
	public class UpdatePolicy 
	{
		/**
		 * Only the DataObject's creator is allowed to update or delete
		 * @see DataObject
		 */
		public static const PRIVATE:int = 0;
		
		/**
		 * Every client is allowed to update or delete the DataObject
		 * @see DataObject
		 */
		public static const PUBLIC:int = 0;
	}
	
}