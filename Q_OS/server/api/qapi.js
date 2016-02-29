(function(){
	//TODO Install packages
	var $ = require('jquery');
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('../storage');

	String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

	module.exports.getUserSecret = function(){
		return localStorage.getItem('tokenCode');
	}
	module.exports.getServer = function(){
		return localStorage.getItem("QServer");
	}
	module.exports.getUserLocation = function(callback){
		getUserLocation(callback);
	}
	function getUserLocation(callback) {
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(callback);
		}
		//position.coords.longitude
		//position.coords.latitude
	}
})();
