(function(){
  var fs = require('fs');
  var util = require('util');
  var request = require('request');

  var clientId = 'anspirit_desktop';                             // Can be anything
  var clientSecret = 'f300b4cb957745b7a756de0536c661f3'; // API key from Azure marketplace

  module.exports.set = function(app, clientS){
    clientId = app;
    clientSecret = clientS;
  }

  module.exports.test = function(){
    var str = 'This is a cool demo to call Microsoft text to speach service in Node.js.';
    getAccessToken(clientId, clientSecret, function(err, accessToken) {
      if(err) return console.log(err);
      textToSpeech(str, 'test.wav', accessToken, function(err) {
        if(err) return console.log(err);
        console.log('Wrote out: ' + 'test.wav');

        speechToText('test.wav', accessToken, function(err, res) {
          if(err) return console.log(err);
          console.log('Confidence ' + res.results[0].confidence + ' for: "' + res.results[0].lexical + '"');
        });
      });
    });
  };

  // ==== Helpers ====

  var getAccessToken = function(clientId, clientSecret, callback) {
    request.post({
      url: 'https://oxford-speech.cloudapp.net/token/issueToken',
      form: {
        'grant_type': 'client_credentials',
        'client_id': encodeURIComponent(clientId),
        'client_secret': encodeURIComponent(clientSecret),
        'scope': 'https://speech.platform.bing.com'
      }
    }, function(err, resp, body) {
      if(err) return callback(err);
      try {
        var accessToken = JSON.parse(body).access_token;
        if(accessToken) {
          callback(null, accessToken);
        } else {
          callback(body);
        }
      } catch(e) {
        callback(e);
      }
    });
  }

  var textToSpeech = function(text, filename, accessToken, callback) {
    var ssmlTemplate = "<speak version='1.0' xml:lang='en-us'><voice xml:lang='%s' xml:gender='%s' name='%s'>%s</voice></speak>";
    request.post({
      url: 'http://speech.platform.bing.com/synthesize',
      body: util.format(ssmlTemplate, 'en-US', 'Female', 'Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)', text),
      encoding: null,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type' : 'application/ssml+xml',
        'X-Microsoft-OutputFormat' : 'riff-16khz-16bit-mono-pcm',
        'X-Search-AppId': '07D3234E49CE426DAA29772419F436CA',
        'X-Search-ClientID': '1ECFAE91408841A480F00935DC390960',
      }
    }, function(err, resp, body) {
      if(err) return callback(err);
      fs.writeFile(filename, body, 'binary', function (err) {
        if (err) return callback(err);
        callback(null);
      });
    });
  }

  var speechToText = function(filename, accessToken, callback) {
    fs.readFile(filename, function(err, waveData) {
      if(err) return callback(err);

      var thisRequestId = guid();

      request.post({
        url: 'https://speech.platform.bing.com/recognize/query',
        qs: {
          'scenarios': 'ulm',
          'appid': '0b3967c7-1af8-4bf5-a957-60d50ea34857', // This magic value is required
          'locale': 'en-US',
          'device.os': 'wp7',
          'version': '3.0',
          'format': 'json',
          'requestid': thisRequestId, // can be anything
          'instanceid': thisRequestId // can be anything
        },
        body: waveData,
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'audio/wav; samplerate=16000',
          'Content-Length' : waveData.length
        }
      }, function(err, resp, body) {
        console.log(body);
        if(err) return callback(err);
        try {
          callback(null, JSON.parse(body));
        } catch(e) {
          callback(e);
        }
      });
    });
  }

  module.exports.getAccessToken = getAccessToken;
  module.exports.textToSpeech = textToSpeech;
  module.exports.speechToText = speechToText;


  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
})();
