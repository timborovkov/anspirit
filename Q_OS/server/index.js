var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var HubSecret = null;

app.use(bodyParser.json());
app.get('/', function(req, res){
  res.send('Hello, I am QHUB');
});

app.post('/hub', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  console.log("Hub has been requested");
  var secret = req.body.secret;
  var user = req.body.user;
  var task = req.body.task;
  if(user != null && task != null && secret != null){
    var security = require("./api/verifySecurity.js");
    security.accessForUser(user, secret, function(access){
      if(access){
        var responseToSend = {access: true, error: null};
        res.send(JSON.stringify(responseToSend));
        console.log(task);
        //TODO process task
      }else{
        var responseToSend = {access: false, error: 'no access'};
        res.send(JSON.stringify(responseToSend));
      }
    });
  }else{
      res.send(JSON.stringify({error: true, type: 'bad request'}));
  }
});

http.listen(8080, function(){
  //TODO Get hub's secret code
  console.log('listening on *:8080');
});
