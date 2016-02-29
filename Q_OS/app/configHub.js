module.exports.config = function(callback){
  var fs = require('fs');
  var util = require('util');

  //Get hub's coordinates
  var longitude = null;
  var latitude = null;
  qapi.getUserLocation(function(position){
    longitude = position.coords.longitude;
    latitude = position.coords.latitude;


      //Generate sample name for hub. New QHUB etc.
      var hubName = "New best friend (QHUB)";

      //Generate hub secret. Type is integer.
      var secret = Math.floor((Math.random() * 1000000000) + 1000000);

      //Ps. owner for hub must be set after user login

      //Register new hub
      $.ajax({
        type: "get",
        url: 'http://api.anspirit.net/newHub',
        data: {'hubName': hubName, 'secret': secret, 'longitude': longitude, 'latitude': latitude},
        success: function(data){
          var hubData = {'name': hubName, 'secret': secret, 'longitude':longitude, 'latitude': latitude};

          //Save all hub data in to ~/hubData.json
          var file = '../hubData.json';
          var data = JSON.stringify(hubData);
          fs.writeFile(file, data, function(err){
            if(err) {return console.error(err)}
            //Run startup script ~/startup.sh
            var exec = require('child_process').exec;
            //Run startup shell script
            exec("~/starup.sh", function(error, stdout, stderr) {
              //Start server
              exec('node ~/server/index.js', function(error, stdout, stderr){
                 callback();
              });
            });
          });
        },
        error: function(a, error){
          console.error("error configuring hub");
        },
        dataType: "json"
      });
  });
}
