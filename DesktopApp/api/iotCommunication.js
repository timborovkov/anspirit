(function(){
  module.exports.getUserDeviceList = function(userId){

  }
  module.exports.getUserHubList = function(userId){

  }
  module.exports.getStateForDevice = function(deviceId){

  }
  module.exports.setStateForDevice = function(state, deviceId){
    /*
      TODO hub
      1. Get POST {userId, secret, state, device}
      2. Verify user
      3. Check if this is users hub
      4. Set state for connected device
      5. Update state in database
    */
    $.ajax({
      type: 'get',
      url: 'http://localhost:3000/devices',//"http://api.anspirit.net:3000/devices",
      data: {task: {state: state, device: deviceId}, secret: qapi.getUserSecret(), user: qapi.getUserId()},
      success: function(data){
        console.log("Data from hub: " + data);
        toRet.done = true;
        global.qSay("Done", function(){});
        cb(toRet);
      },
      error: function(a, error) {
        cb(toRet);
        console.error(error);
      }
    });
  }
  module.exports.getNearestHub = function(callback){
    $.ajax({
      type: "get",
      url:  qapi.getServer() + "/getUserHubList.php",
      data: {'id': qapi.getUserId()},
      dataType: 'json',
      success: function(data){
        var userHubList = JSON.parse(data['hubList']);
        var userHubs = [];
        for (var i = 0; i < userHubList.length; i++) {
          userHubs.push(userHubList[i].position);
        }
        qapi.getUserLocation(function(position){
          var hubsSortedByDistance = geolib.orderByDistance({latitude: position['coords']['latitude'], longitude: position['coords']['longitude']}, userHubs);
          var nearestId = hubsSortedByDistance[0].key;
          var hubData = userHubList[nearestId];
          callback(hubData);
        })
      },
      error: function(a, error){
        console.error(error);
      }
    });
  }
})();
