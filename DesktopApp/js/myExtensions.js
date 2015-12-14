var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
$ = require('jquery');
var fs = require('fs');
var platform = require('./api/platform.js');

var userExtensions = null;

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

function drawTable(data) {
	if (Object.keys(data).length > 0){
	    for (var i = 0; i < data.length; i++) {
	        drawRow(data[i]);
	    }
	}else{
		$(".inform_lbl").append('<h3 style="position: relative; left: 20%;">You dont have extensions yet</h3>');
	}
}

function drawRow(rowData) {
    var row = $("<tr />")
    $(".extensions tbody").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
    row.append($("<td align='center'><img src='" + rowData.icon + "' height='50px' width='50px'></td>"));
    row.append($("<td align='center'>" + rowData.name + "</td>"));
    row.append($("<td align='center'>" + rowData.description + "</td>"));
    row.append($("<td align='center'><button onclick='deleteExtension(\"" + rowData.id + "\", \"" + rowData.name + "\")'>Delete</button></td>"));
}


//actions
function deleteExtension(rowId, rowName){
    swal({
    title: "Are you sure?",
    text: "You will delete extension!",
    type: "warning",   showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    closeOnConfirm: false,
    closeOnCancel: true
    },
    function(isConfirm){
      if(isConfirm){
              swal({
              title: "Do you want to delete extension forever?",
              text: "Otherwise extension will be restored everytime you start app!",
              type: "warning",   showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it forever!",
              cancelButtonText: "No, delete for this session!",
              closeOnConfirm: true,
              closeOnCancel: true
            },function(forever){
              if(forever){
                var error = false;
                $.ajax({
                  type: "get",
                  url: "http://80.223.209.170/tim/userExtensions.php",
                  data: {'user': localStorage.getItem('id'), 'delete': true, 'extID': rowId},
                  dataType: "json",
                  success: function(data){
                          var filePath = "rules/" + rowName + ".js" ;
                          fs.unlink(filePath, function (err) {});

                          $.ajax({
                    				type: 'get',
                    				url: 'http://80.223.209.170/tim/userExtensions.php',
                    				data: {'user': localStorage.getItem('id')},
                    				dataType: 'json',
                    				success: function(){
                              array.splice(userExtensions, userExtensions[rowId]);
                    					var file = './rules.json';
                    					var exts = JSON.stringify(userExtensions);
                    					fs.writeFile(file, exts, function(){console.log('rules.json is now updated')});
                    					for(var i = 0; i < extensions.length; i++) {
                    					  var file = fs.createWriteStream("rules/" + extensions[i]['name'] + ".js");
                    						var request = http.get(extensions[i]['pathToExt'], function(response){
                    							response.pipe(file);
                    						});
                    					}

                              sweetAlert('Done', 'extension is now deleted', 'success');
                    				},
                    				error: function(a, error){
                              alert(error);
                    					console.log(error);
                    				}
                    			});
                        }
                    });
                }else{
                  var filePath = "rules/" + rowName + ".js" ;
                  fs.unlink(filePath, function (err) {});
                  var file = './rules.json';
                  var exts = JSON.stringify(userExtensions);
                  fs.writeFile(file, exts, function(){console.log('rules.json is now updated')});
                }
            }
          )
      }else{
        swal("Cancelled", "Your extension is safe :)", "error");
      }
    });
}
