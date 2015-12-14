//
function notifyMe(text) {
    var notification = new Notification(text);
}
notifyMe("Q stopped working while you are in market");

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
$ = require('jquery');

var platform = require('./api/platform.js');
var ipc = require('ipc');

var extensions = null;

$.ajax({
    type: "get",
    url: 'http://80.223.209.170/tim/allExtensions.php',
    data: {},
    success: function(data){
      drawTable(data)
      extensions = data;
    },
    error: function(a, error){
      console.log(error);
    },
    dataType: "json"
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
    row.append($("<td align='center'><button class='buyBtn' onclick='buy(\"" + rowData.id + "\", " + free + ")'>Buy</button></td>"));
    row.append("<td align='center'><button onclick='details(\"" + rowData.id + "\", \"" + rowData.name + "\")'>Details</button></td>");
}
function buy(ext, free){
  $.ajax({
    type: "get",
    url: 'http://83.136.248.193/qp/buyExt.php',
    data: {'ext': ext, 'user':localStorage.getItem('id'), 'free': free},
    success: function(main){
      if(main.done){
        nextStepBuy(main, ext);
      }else{
        sweetAlert('Error', 'Server error!', 'error');
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
      if (main.toPay == 0){
              //nothing to pay
              $.ajax({
                type: "get",
                url: 'http://80.223.209.170/tim/buyExt.php' ,
                data: {'free': true, 'user': localStorage.getItem('id'), 'extID': ext},
                success: function(data){
                  reqFinished = true;
                  if(data.done){
                    done = true;
                  }else{
                    //Fail
                    no = true;
                  }
                },
                error: function(a, error){
                    sweetAlert('Error', 'Failed connect to the server', 'error');
                    console.log(error);
                },
                dataType: "json"
              });
      }else{
            $.ajax({
              type: "get",
                url: 'http://80.223.209.170/tim/dataForIP.php' ,
                data: {'user': localStorage.getItem('id'), 'ext': main.extensionName, 'price': (main.toPay * 100), 'setData': true},
                success: function(data){
                  reqFinished = true;
                  console.log(2);
                  if(data.done){
                    console.log(3);
                    console.log(data);
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
            console.log(1);
      }
      $.ajax({
        type: "get",
        url: 'http://80.223.209.170/tim/checkIfPayed.php' ,
        data: {'user': localStorage.getItem('id'), 'ext': ext},
        success: function(data){
            ipc.send('payWinHide');
            sweetAlert('Done', 'New extension has been instaled.\n Extension will start working after you restart app!', 'success');
        },
        error: function(a, error){

        },
        dataType: "json"
      });
  }
function details(ext, name){
  localStorage.setItem('detailsForExtName', name);
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
