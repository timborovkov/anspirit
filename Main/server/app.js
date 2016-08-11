var express = require('express');
var app = express();
var nlp = require('nlp_compromise');
var getAction = require('./action');
var ipLocation = require('ip-location')
var request = require('request');

//Static page
app.use('/', express.static('website'));

app.get('/speech', function(req, res){
  var ip = req.headers['x-forwarded-for'] ||
       req.connection.remoteAddress ||
       req.socket.remoteAddress ||
       req.connection.socket.remoteAddress;
  var lang = req.query.lang;

  //Get client's location
  ipLocation(ip, function (err, ipData) {
    var city = ipData.city;

    switch (lang) {
      case 'en':
          speechProcess.english(req.query, function(data){
            res.send(data);
          });
        break;
      default:
          speechProcess.english(req.query, function(data){
            res.send(data);
          });
    }

  });
});

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

var speechProcess = {
  english: function(query, callback){
    var speechInput = query.speech,
    uid = query.uid,
    uname = query.uname,
    client = query.client;

    //Simplify speech innput
    speechInput = nlp.text(speechInput).root();

    //Get sentence
    var sentence = nlp.sentence(speechInput);

    getAction(speechInput, function(res){
      //TODO: extensions

      //Perform next steps only, if no extension has been used!

      switch (res.action) {
        case "smalltalk.greetings":
          sentenceIs.smalltalk(res, uname, uid, client, callback);
          break;
        case "weather":
          sentenceIs.weather(res, uname, uid, client, callback);
          break;
        default:
          // Return simple anwser
          callback({speechanwser: "Sorry " + uname + ", but I can't really understand what you want", codeToRun: ""});
      }
    });
  },
  finnish: function(query, callback){

  }
};

// Sentence types
var sentenceIs ={
  smalltalk: function(res, uname, uid, client, callback){
    //smalltalk.greetings
    callback({speechanwser: res.fulfillment.speech, codeToRun: ""});
  },
  weather: function(res, uname, uid, client, callback){
    //Use weather module fot processing 
    require('modules/weather')(res, uname, uid, client, callback);
  },
  homeControl: function(res, uname, uid, client, callback){
    //Use weather module fot processing 
    require('modules/homecontrol')(res, uname, uid, client, callback);
  },
  socialMedia: function(res, uname, uid, client, callback){
    //Use weather module fot processing 
    require('modules/socialmedia')(res, uname, uid, client, callback);  
  }
};


//Add contains method to string
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };