module.exports = function(res, uname, uid, client, callback){
    //Get weather in res.parameters.location or here
    //On res.parameters.time or now
    var when = new Date(res.parameters.time) || null;
    var where = res.parameters.location || city;
    request('http://maps.google.com/maps/api/geocode/json?address='+where, function (error, response, city) {
      console.log(city);
      //TODO: latitude and longitude does not work
      var latitude = city.results.geometry.location.lat;
      var longitude = city.results.geometry.location.lng;
      if (!error && response.statusCode == 200) {
        request('https://api.forecast.io/forecast/abb71dbf2ec8e1265aa0f5f1b6a5ef33/'+latitude+','+longitude+'?units=si', function (error, response, weatherRes) {
          if (!error && response.statusCode == 200) {
            if(when === null){
              //Weather now
              callback({speechanwser: weatherRes.hourly.summary + " and it is " + weatherRes.currently.temperature + " degrees celsius in " + where, codeToRun: ""});
             }else{
               //TODO: Weather on "when"
              callback({speechanwser: weatherRes.hourly.summary + " and it is " + weatherRes.currently.temperature + " degrees celsius in " + where, codeToRun: ""});
             }
          }
        });
      }
    });
};
module.exports.weatherIcons = {
  'clear-day': 'http://i.imgur.com/RgglKUc.png',
  'clear-night': 'http://i.imgur.com/QnjkzQ4.png',
  'rain': 'http://i.imgur.com/AfapDlb.png',
  'snow': 'http://i.imgur.com/GKODSj2.png',
  'sleet': 'http://i.imgur.com/ooh5nEA.png',
  'wind': 'http://i.imgur.com/f5FM7Qd.png',
  'fog': 'http://i.imgur.com/J2XTN2j.png',
  'cloudy': 'http://i.imgur.com/tmVvYFm.png',
  'partly-cloudy-day': 'http://i.imgur.com/MRZEN7b.png',
  'partly-cloudy-night': 'http://i.imgur.com/FKbl1Iq.png'
}
