var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

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
        alert('Quit')
      }
    }
    ]
  }
]
menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);