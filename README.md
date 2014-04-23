
![Gordon Server Logo][1]
Gordon Client
=============
There are currently two client APIs for the Gordon Server:

 - HTML5/JS
 - Adobe Flash/Air

----------

### Install

With [npm](http://npmjs.org) do:
```
npm install gordon-client
```
The HTML5/JS version is found under ``lib/js/src`` or ``lib/js/dist``.
The Adobe Flash/Air version is found under ``lib/as3/src`` or ``lib/as3/dist``.


See also [gordon-server][2] and [gordon-examples][3].

----------

###Usage
####HTML5/JS
In your HTML file import the script:
```html
<script src="js/gordon-client-0.1.0.min.js"></script>
```

The JS client uses the ``gordon`` namespace.
```JS
  var g = new gordon.Client();
  //Connect to the server
  g.connect('ws://127.0.0.1:9092', function (err) {
    if (err) {
        console.log('Connection error. Code:', err.id);
        return;
    }

    var name = 'Gordon' + Math.round(Math.random() * 1000);
    console.log('Connected.');

    //Join a session and room
    g.join('session1', 'lobby', name, null, function (err, user) {
       if (err) {
            console.log('Join error. Code:', err.id);
            return;
        }
        console.log('Joined. User id:', user.id);
    });
});
```

Join a session with a custom DataObject

```JS
//create the users's dataObject
var dataObject = new gordon.DataObject();
dataObject.setInt16(0, -200);
dataObject.setInt16(1, -200);
g.join('session1', 'lobby', name, dataObject, function (err, user) {
   if (err) {
        console.log('Join error. Code:', err.id);
        return;
    }
    console.log('Joined. User id:', user.id);
});
```

####Adobe Flash/Air
Either add the ``src`` folder to your classpath or add the provided ``swc`` file to your library.
```JS
public function init():void
{
    _gordon = new GordonClient();

    _gordon.events.onConnect.add(onConnect);
    _gordon.events.onDisconnect.add(onDisconnect);
    _gordon.events.onJoin.add(onJoin);
	_gordon.events.onJoinError.add(onJoinError);

    _gordon.connect("127.0.0.1", 9091);
}

protected function onConnect():void
{
	trace("Connected!");
	var name:String = "gordon" + int(Math.random() * 1000);
	trace("Joining as", name, "...");
	_gordon.join("session1", "lobby", name);
}

protected function onDisconnect():void
{
	trace("Disconnected!");
}

protected function onJoinError(errorCode:int):void
{
	trace("Join error. Code:", errorCode);
}

protected function onJoin(user:User):void
{
	trace("Joined.");
}
```
Join a session with a custom DataObject
```JS
protected function onConnect():void
{
	trace("Connected!");

	var dataObject:DataObject = new DataObject();
	dataObject.setShort(PlayerDataKey.X_POS, -200);
	dataObject.setShort(PlayerDataKey.Y_POS, -200);

	var name:String = "gordon" + int(Math.random() * 1000);

	trace("Joining as", name, "...");
	_gordon.join("session1", "lobby", name, dataObject);
}

```



  [1]: https://cloud.githubusercontent.com/assets/7307652/2774582/445a43cc-caba-11e3-92f2-a2bc7600b52b.png
  [2]: https://github.com/bma73/gordon-server
  [3]: https://github.com/bma73/gordon-examples