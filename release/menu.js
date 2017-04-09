// node-webkit native menus

// Load native UI library
var gui = require('nw.gui');

// Create an empty menu
var menu = new gui.Menu({ 'type': 'menubar' });
 

// Add some items
menu.append(new gui.MenuItem({ label: 'Reload Game', click: function()
	{
		location.href = "index.html";
		//location.reload(); 
	} 
}));
menu.append(new gui.MenuItem({ type: 'separator'}));
menu.append(new gui.MenuItem({ label: 'Reset Data', click: function()
	{
		//delete the save file, crude but should work
		try{
			var fs = require('fs');
			var filepath = './save/' + 'mazesave';
			fs.unlinkSync(filepath);
		}
		catch(err)
		{
			//no file, do nothing
		}
		location.href = "index.html";
		//location.reload(); //reload
	}
}));

console.log(menu);

gui.Window.get().menu = menu;
