var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var ipc = require('ipc');

var menu = new Menu();
var template = [
  {
    label: 'qproject',
  },
  {
    label: 'Help',
    submenu: [
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function() {
        ipc.send("appQuit");
      }
    }
    ]
  }
]
menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
