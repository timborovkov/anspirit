(function(){
  module.exports.getUserDeviceList = function(userId){

  }
  module.exports.getUserHubList = function(userId){

  }
  module.exports.getStateForDevice = function(deviceId){

  }
  module.exports.setStateForDevice = function(state, deviceId){

  }
  module.exports.getUserSecret = function(userId, email, password) {
    $.ajax({
        type: "post",
        url: qapi.getServer() + '/getUserSecret.php' ,
        data: {'id': qapi.getUserId(), 'email': , 'password': },
        success: function(data){

        },
        error: function(a, error){

        },
        dataType: "json"
    });
  }
})();
