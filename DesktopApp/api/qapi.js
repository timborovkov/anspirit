(function(){
	var $ = require('jquery');
	var apiai = require('apiai');
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./storage');
	var Forecast = require('forecast');

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
	module.exports.GetWeatherIcon = function(){
		return localStorage.getItem('weatherIcon');
	}
	module.exports.getServer = function(){
		return localStorage.getItem("QServer");
	}
	module.exports.getUserName = function(){
		return localStorage.getItem('name');
	}
	module.exports.getUserLang = function(){
		return localStorage.getItem('lang');
	}
	module.exports.getUserCountry = function(){
		return localStorage.getItem('country');
	}
	function getUserCountry(){
		return localStorage.getItem('country');
	}
	module.exports.getUserId = function(){
		return localStorage.getItem('id');
	}
	module.exports.getUserLocation = function(callback){
		getUserLocation(callback);
		//position.coords.longitude
		//position.coords.latitude
	}
	function getUserLocation(callback){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(callback);
		}
		//position.coords.longitude
		//position.coords.latitude
	}
	module.exports.forecast = function(callback){
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
							minutes: 30,
							seconds: 00
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
				callback(weather);
			});
		});
	}
	module.exports.apiAi = function(query, callback){
		var app = null;
		switch (module.exports.getUserLang()) {
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
})();
