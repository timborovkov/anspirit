var platform = require('./api/platform.js');
var $ = require('jquery');
var apiai = require('apiai');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./storage')
var geoip = require('geoip-lite');
var Forecast = require('forecast');

//Add support of some cool API functions

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function open(link){
	var cp = require("child_process");
	cp.exec('open ' + link,
	  function (error, stdout, stderr) {
	    if (error !== null) {
	      console.error('app execution error: ' + error);
	    }
	});
}
function getPlatform(){
	return platform;
}
function getServer(){
	return localStorage.getItem("QServer");
}
function getUserName(){
	return localStorage.getItem('name');
}
function getUserLang(){
	return localStorage.getItem('lang');
}
function getUserCountry(){
	return localStorage.getItem('country');
}
function getUserLocation(callback){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(callback);
	}
	//position.coords.longitude
	//position.coords.latitude
}
function forecast(){
	var longitude, latitude;
	getUserLocation(function(geo){
		longitude = geo.coords.longitude;
		latitude = geo.coords.latitude;

		var forecast;
		//Init
		switch(getUserCountry()){
			case "USA":
				forecast = new Forecast({
					service: 'forecast.io',
					key: 'eb2d99a1712c6a641d2adfba71422b64',
					units: 'f', // Only the first letter is parsed
					cache: true,      // Cache API requests?
					ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
						minutes: 27,
						seconds: 45
						}
				});
				break;
			default:
				forecast = new Forecast({
					service: 'forecast.io',
					key: 'eb2d99a1712c6a641d2adfba71422b64',
					units: 'c', // Only the first letter is parsed
					cache: true,      // Cache API requests?
					ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
						minutes: 30,
						seconds: 00
						}
				});
				break;
		}
		forecast.get([latitude, longitude], function(err, weather) {
		  if(err) return console.log(err);
		  console.log(weather);
		});
	});
}
function apiAi(query, callback){

	//NO support of FINNISH language

	var app = null;
	switch (getUserLang()) {
		case "en":
			app = apiai("4d02c7ec3eb7475fa8ec7cfb5f1384a8", "7cb081b3-3963-4d2a-8cd2-338064e3c643");
			break;
		case "ru":
			app = apiai("5e5c8ccfbbdc467fb075ea5afb5b6912", "7cb081b3-3963-4d2a-8cd2-338064e3c643");
			break;
	}

	var request = app.textRequest(query);

	request.on('response', function(response) {
	    console.log(response);
			callback(response);
			return response;
	});

	request.on('error', function(error) {
	    console.error(error);
			return;
	});

	request.end()
}
function notifyMe(text) {
    var notification = new Notification(text);
}
