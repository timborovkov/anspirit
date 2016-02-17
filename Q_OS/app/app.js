var app = require('app')
var BrowserWindow = require('browser-window')
var ipc = require('ipc');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./storage');

app.on('ready', function(){

  var win = new BrowserWindow({
     show: false,
     fullscreen: true,
     height: 320,
     width: 480,
     resizable: false,
     icon:'./pictures/anspirit.png'
   })
  win.webContents.openDevTools();
  win.loadURL('file://' + __dirname + '/html/start.html');
  win.show();


  var paymentWindow = new BrowserWindow({
     show: false,
     width: 100,
     height: 200,
     frame: true,
     alwaysOnTop: true,
     resizable: false
  })
  ipc.on('payWinShow', function(){
    //paymentWindow.openDevTools();
  	paymentWindow.loadURL('http://anspirit.org/php/pay.php');
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
  detailsWindow.loadURL('file://' + __dirname + '/html/details.html');
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
