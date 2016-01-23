(function(){
  var $ = require('jquery');
  var qapi = require('./api/qapi.js');
  var userExtensions = null;

  $("document").ready(function(){
    $.ajax({
        type: "get",
        url: qapi.getServer() + '/userExtensions.php',
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

  window.drawTable = function(data) {
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
      row.append($("<td align='center'><button class='deleteBtn' onclick='deleteExtension(\"" + rowData.id + "\", \"" + rowData.name + "\")'>Delete</button></td>"));
  }


  //actions
  function deleteExtension(rowId, rowName){
      sweetAlert({
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
                sweetAlert({
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
                    url: qapi.getServer() + "/userExtensions.php",
                    data: {'user': qapi.getUserId(), 'delete': true, 'extID': rowId},
                    dataType: "json",
                    success: function(data){
                            var filePath = "rules/" + rowName + ".js" ;
                            fs.unlink(filePath);
                            array.splice(userExtensions, userExtensions[rowId]);
                            var file = './rules.json';
                            var exts = JSON.stringify(userExtensions);
                            fs.writeFile(file, exts);
                            sweetAlert('Done', 'extension is now deleted', 'success');
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
          sweetAlert("Cancelled", "Your extension is safe :)", "error");
        }
      });
  }
})();
