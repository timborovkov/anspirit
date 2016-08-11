var apiai = require('apiai');

var app = apiai("55d2d518eab1453b9ef4940b5ebb11df");

module.exports = function(speech, callback){
  var request = app.textRequest(speech);

  request.on('response', function(response) {
    callback(response.result);
    /*
    {
        "source": "domains",
        "resolvedQuery": "hi",
        "action": "smalltalk.greetings",
        "parameters": {
          "simplified": "hello"
        },
        "metadata": {},
        "fulfillment": {
          "speech": "Hi there, friend!"
        },
        "score": 0
    }
    */
  });

  request.on('error', function(error) {
      console.log(error);
      callback(error)
  });

  request.end();
}
