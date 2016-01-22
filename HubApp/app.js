const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;

app.on('window-all-closed', function() {
  app.quit();
});
app.on('ready', function(){
  //Main window
  var win = new BrowserWindow({
     width: 480,
     height: 340,
     show: false

  });
  win.on('closed', function() {
    win = null;
  });
  win.webContents.openDevTools();
  win.loadURL('file://' + __dirname + '/html/index.html');
  win.show();
})
