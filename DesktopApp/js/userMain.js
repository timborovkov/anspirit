var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./storage');
$ = require('jquery');
require('jquery-ui');

(function(){
    var fs = require('fs');
    var platform = require('../api/platform.js');
    var international = require('../api/international.js');
    var qapi = require('../api/qapi.js');

    $(document).ready(function() {
      $(".content").load("./home.html");

      //Setup UI text
      international.prepareTranslates(function(){
          document.getElementById("myExtensions_menu").innerHTML = international.getGUIText("My Extensions");
          document.getElementById("market_menu").innerHTML = international.getGUIText("Market");
          document.getElementById("home_menu").innerHTML = international.getGUIText("Home");
          document.getElementById("settings_menu").innerHTML = international.getGUIText("Settings");
          document.getElementById("logout_btn").innerHTML = international.getGUIText("Logout");
      });
        var weatherIcon = qapi.GetWeatherIcon();
        switch (weatherIcon) {
          case 'wind':
            $(".cardDiv").css( "background-image", "url(\"../pictures/weather/wind.jpg\")");
            break;
          case 'rain':
            $(".cardDiv").css( "background-image", "url(\"../pictures/weather/glass.jpg\")");
            break;
          case 'snow':
            $(".cardDiv").css( "background-image", "url(\"../pictures/weather/snow.jpg\")");
            break;
          case 'clear-day':
            $(".cardDiv").css( "background-image", "url(\"../pictures/weather/clear-day.jpg\")");
            break;
          case 'clear-night':
            $(".cardDiv").css( "background-image", "url(\"../pictures/weather/clear-night.jpg\")");
            break;
          case 'fog':
            $(".cardDiv").css( "background-image", "url(\"../pictures/weather/fog.jpg\")");
            break;
          case 'cloudy':
            $(".cardDiv").css( "background-image", "url(\"../pictures/weather/cloudy.jpg\")");
            break;
          case 'partly-cloudy-day':
            $(".cardDiv").css( "background-image", "url(\"../pictures/weather/partly-cloudy-day.jpg\")");
            break;
          case 'partly-cloudy-night':
            $(".cardDiv").css( "background-image", "url(\"../pictures/weather/partly-cloudy-night.jpg\")");
            break;
          case 'sleet':
            $(".cardDiv").css( "background-image", "url(\"../pictures/weather/sleet.jpg\")");
            break;
        }

      $(".menuElement").click(function() {
        var val  = $(this).attr('id');
        switch(val) {
          case "home_menu":
            $(".content").load("./home.html");
            break;
          case "myExtensions_menu":
            $(".content").load("./myExtensions.html");
            break;
          case "market_menu":
            $(".content").load("./market.html");
            break;
          case "settings_menu":
            $(".content").load("./settings.html", function() {
              document.getElementById("name_field").value = localStorage.getItem('name');
              document.getElementById("lang_field").value = localStorage.getItem('lang');
              document.getElementById("country_field").value = localStorage.getItem('country');
            });
            break;
        }
      });
    });
})();
  function logout () {
  	localStorage.removeItem('name')
  	localStorage.removeItem('id')
  	localStorage.removeItem('version')
  	localStorage.removeItem('pass')
  	localStorage.removeItem('email')
  	localStorage.removeItem('lang')
  	localStorage.removeItem('age')

  	$(location).attr('href','file://' + __dirname + '/login.html')
  }
