var express = require('express');
var app = express();
var getmac = require('getmac')
var Milight = require("milight");
var browser = require('iotdb-arp');
var request = require('request');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/bulb', function(req, res){
  //TODO must switch wifi network to 'easybulb'

  var action = req.query.action;
  var groupId = req.query.group;
  var adjustments = JSON.parse(req.query.adj); //parse to json

  var milight = new Milight({
      host: "10.10.100.254", //TODO search easybulb ip using node evilscan (Hi-flying electronics technology)
      broadcast: true
  });

  switch (action) {
    case 'on':
        // All zones on
        milight.zone(groupId).on();
        res.send('{done: true}');
      break;
    case 'off':
        // All zones on
        milight.zone(groupId).off();
        res.send('{done: true}');
      break;
    case 'color':
        milight.zone(groupId).rgb(adjustments.color);
        res.send('{done: true}');
      break;
    case 'white':
        milight.zone(groupId).white(adjustments.brightness);
        res.send('{done: true}');
      break;
    default:
        res.send('{done: false}');
  }
});

app.get('/search', function(req, res){
  var devices = [[]];
  var last_found = Date.now();
  browser.browser({}, function(error, d){
      if (error) {
          console.log("#", error);
      } else if (d) {
        last_found = Date.now();
        console.log("ip: "+d.ip + " mac: "+d.mac);
        devices.push(d);
      }
  });
  res.send('done');

  setInterval(function() {
    if(last_found < Date.now() - 20000){
      //Ended search
      console.log("Ended");
      searchInMacs(devices);
      clearInterval(this);
    }else{
      //Still searching
    }
  }, 4000);
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});

function searchInMacs(d){
  for (var i = 1; i < d.length; i++){
    if(d[i].mac != null && d[i].ip != null){
      getVendor(d[i].mac, d[i].ip, function(vendor, d){
        if (vendor != null) {
          if (vendor.indexOf("Hi-flying electronics") >= 0){
            //easybulb
            console.log("EasyBulb found");
            console.log("Ip: " + d.ip);
            console.log("Mac: " + d.mac);
            console.log("Vendor" + vendor);
          }else if (false) { //TODO
            //WeMo
          }else{
            //Something else
          }
        }else{
          //Error
        }
        if (i == d.length -1) {
          console.log("DONE");
        }
      });
    }else{
      console.log("Null");
    }
  }
}

function getVendor(mac, ip, callback){
  request('http://www.macvendorlookup.com/api/v2/'+mac, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var result = JSON.parse(body);
      var vendor = result[0].company;
      callback(vendor, {"ip": ip, "mac": mac});
    }else{
      callback(null, {"ip": ip, "mac": mac});
    }
  })
}
