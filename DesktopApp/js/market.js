(function(){
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./storage');
  $ = require('jquery');
  var platform = require('../api/platform.js');
  var ipc = require('ipc');
  var extensions = null;
  var qapi = require('../api/qapi.js');

  $("document").ready(function(){
    $.ajax({
        type: "get",
        url: qapi.getServer() + '/allExtensions.php',
        data: {},
        success: function(data){
          drawTable(data)
          extensions = data;
        },
        error: function(a, error){
          console.error(error);
        },
        dataType: "json"
      });
  });

  function drawTable(data) {
  	if (Object.keys(data).length > 0){
  	    for (var i = 0; i < data.length; i++) {
  	        drawRow(data[i]);
  	    }
  	}else{
  		$(".inform_lbl").append('<h3 style="position: relative; left: 20%;">We dont have any extensions yet</h3>');
  	}
  }

  function drawRow(rowData) {
      var row = $("<tr />");
      var free = false;
      $(".extensions tbody").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
      row.append($("<td align='center'><img src='" + rowData.icon + "' height='50px' width='50px'></td>"));
      row.append($("<td align='center'>" + rowData.name + "</td>"));
      row.append($("<td align='center'>" + rowData.developer + "</td>"));
      row.append($("<td align='center'>" + rowData.description + "</td>"));
      row.append($("<td align='center'>" + rowData.downloads + "</td>"));
      if(rowData.price <= 0){
        row.append($("<td align='center'>Free</td>"));
        free = true;
      }else{
        row.append($("<td align='center'>" + rowData.price + "</td>"));
        free = false;
      }
      row.append($("<td align='center'><button class='buyBtn' onclick='window.buy(\"" + rowData.id + "\", " + free + ")'>Buy</button></td>"));
      row.append("<td align='center'><button onclick='window.details(\"" + rowData.id + "\", \"" + rowData.name + "\")'>Details</button></td>");
  }
  window.buy = function(ext, free){
    $.ajax({
      type: "get",
      url: qapi.getServer() + '/buyExt.php',
      data: {'ext': ext, 'user': qapi.getUserId(), 'free': free},
      success: function(main){
        if(!free){
          nextStepBuy(main, ext);
        }else{
          //nothing to pay
          sweetAlert('Done', 'New extension has been instaled.\n Extension will start working after you restart app!', 'success');
        }
        },
      error: function(a, error){
        sweetAlert('Failed', 'Failed to buy current extension', 'error');
        console.log(error);
      },
      dataType: "json"
    });
  }
  function nextStepBuy(main, ext){
        var no = false;
        var reqFinished = false;
              $.ajax({
                  type: "get",
                  url: qapi.getServer() + '/dataForIP.php' ,
                  data: {'user': qapi.getUserId(), 'ext': main.extensionName, 'price': (main.toPay * 100), 'setData': true},
                  success: function(data){
                    reqFinished = true;
                    if(data.done){
                      ipc.send('payWinShow');
                    }else{
                      //Fail
                      console.log('error');
                      sweetAlert('Error', 'Failed connect to the server', 'error');
                    }
                  },
                  error: function(a, error){
                      no=true;
                      console.log(error);
                  },
                  dataType: "json"
              });

              $.ajax({
                type: "get",
                url: getServer() + '/checkIfPayed.php' ,
                data: {'user': qapi.getUserId(), 'ext': ext},
                success: function(data){
                    ipc.send('payWinHide');
                    sweetAlert('Done', 'New extension has been instaled.\n Extension will start working after you restart app!', 'success');
                },
                error: function(a, error){
                    ipc.send('payWinHide');
                    sweetAlert('Error', 'Connection timeout...', 'error');
                },
                dataType: "json"
              });
    }
  window.details = function(ext, name){
    amplify.store('detailsForExt', ext);
    amplify.store("allExtensions", extensions);
    ipc.send('detailsShow');
  }
  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }
})();
