$ = require('jquery');
var fs = require('fs');
var platform = require('./api/platform.js');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

$(document).ready(function() {
  $(".content").load("./home.html");
  
  $(".menuElement").click(function() {
    var val  = $(this).text();
    switch(val) {
      case "Home":
        $(".content").load("./home.html");
        break;
      case "My Extensions":
        $(".content").load("./myExtensions.html", function() {
          $.ajax({
              type: "get",
              url: 'http://80.223.209.170/tim/userExtensions.php',
              data: {'user': localStorage.getItem('id')},
              success: function(data){
                userExtensions = data;
                drawTable(data);
              },
              error: function(a, error){
                console.log(error);
              },
              dataType: "json"
            });
        });
        break;
      case "Market":
        $(".content").load("./market.html");
        break;
      case "Settings":
        alert('Settings');
        break;
    }
  });
});
