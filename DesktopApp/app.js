var app = require('app')
var BrowserWindow = require('browser-window')
var ipc = require('ipc');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

app.on('ready', function(){

  var win = new BrowserWindow({
     show: false,
     width: 1280,
     height: 720,
     resizable: false,
     fullscreen: false,
     icon:'./pictures/anspirit.png'
   })
  win.webContents.openDevTools();
  win.loadURL('file://' + __dirname + '/start.html');
  win.show();


  var paymentWindow = new BrowserWindow({
     show: false,
     width: 400,
     height: 600,
     frame: true,
     alwaysOnTop: true,
     resizable: false
  })
  ipc.on('payWinShow', function(){
    //paymentWindow.openDevTools();
  	paymentWindow.loadURL('http://80.223.209.170/tim/pay.php');
  	paymentWindow.show();
  });
  ipc.on('payWinHide', function(){
	   paymentWindow.hide();
  });

  var detailsWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 400,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
  })
  //detailsWindow.webContents.openDevTools();
  detailsWindow.loadURL('file://' + __dirname + '/details.html');
  ipc.on('detailsShow', function(){
    detailsWindow.show();
  });
  ipc.on('detailsHide', function(){
    detailsWindow.hide();
  });

  win.on('closed', function() {
    app.quit();
  });

  ipc.on('appQuit', function(){
    app.quit();
  });
})
