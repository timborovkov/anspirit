  $ = require('jquery');
  var fs = require('fs');
  var platform = require('./api/platform.js');
  var LocalStorage = require('node-localstorage').LocalStorage;
  var localStorage = new LocalStorage('./storage');
  var international = require('./api/international.js');
  var qapi = require('./api/qapi.js');

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
