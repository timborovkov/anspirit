var hubsFound = [];
var map;

function loaded(){
    //Get all user`s hubs and their data
    $.ajax({
      type: "post",
      url:  qapi.getServer() + "/getUserHubList.php",
      data: {'id': qapi.getUserId(), 'password': localStorage.getItem('pass')},
      dataType: 'json',
      success: function(data){
        //data variable contains list of all users hubs
        data = data.hubList;
        hubsFound = data;
        drawTable(data);
      },
      error: function(a, error){
        console.error(error);
      }
    });
}
function drawTable(data) {
    if (Object.keys(data).length > 0){
        var count = 0;
        var tableRowContent = "";
        for (var i = 0; i <= data.length; i++) {
            count++;
            var name = data[i].name;
            var id = data[i].id;
            tableRowContent = tableRowContent + "<td class='hubBtn'><button class='hubBtn' type='button' onclick='hubBtnPrsd("+i+", \""+name+"\")'><img src='../pictures/home.ico' class='hubBtnImg' width='70px'><br>"+name+"</button></td>";
            if(count == 5){
              console.log(1);
              //Go to new row
              //Apend all data to new row
              count = 0;
              var row = $("<tr />")
              $(".homeHubs tbody").append(row);
              row.append($(tableRowContent));
            }else if (i == data.length - 1) {
              console.log(2);
              //Last element to add
              //Just append all the data to new row
              var row = $("<tr />")
              $(".homeHubs tbody").append(row);
              row.append($(tableRowContent));
              count = 0;
            }else{
              console.log(3);
              //Add data to table row content variable
            }
        }
    }else{
      $(".inform_lbl").append('<h3 style="position: relative; left: 20%;">You dont have hubs yet</h3>');
    }
}
function hubBtnPrsd(id, name) {
  //Show table of devices connected to this hub
  alert(name);
  /*
  1. Get hub info from server
    1,5. Get connected devices also
  2. Display map in .hubOnMap
  3. Display hub infornation
  4. Display connected devices by type in table
  */
  var hub = hubsFound[id];

}
function addHub(){
  //Enter code reading on your hubs screen to connect it
  //Now you can change settings for hub and use it
  alert('Coming soon');
}
function loadMap(){
    console.log("map");
    //Google maps setup
    map = new google.maps.Map(document.getElementById('googleMap'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 10
    });
}
