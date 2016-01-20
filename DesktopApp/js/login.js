$ = require('jquery')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./storage');

//Process form
function login(){
  $.ajax({
    type: "post",
    url: getServer() + '/login.php',
    data: {'email': $('#login_email').val(), 'password': $('#login_pass').val()},
    success: function(data){
      processLoginResult(data);
    },
    error: function(a, error){
      console.log(error);
    },
    dataType: "json"
  });
}
function processLoginResult(data){
  if (!data.login) {
    sweetAlert('Failed', 'Wrong login\nor\npassword', 'error');
  }else{
    localStorage.setItem('id', data.id);
    localStorage.setItem('name', data.name);
    localStorage.setItem('version', data.version);
    localStorage.setItem('lang', data.lang);
    localStorage.setItem('age', data.age);
    localStorage.setItem('tokenCode', data.tokenCode);
    localStorage.setItem('email', data.email);
    localStorage.setItem('pass', $('#login_pass').val());

    $(location).attr('href','file://' + __dirname + '/userMain.html');
  }
}


$(document).ready(function(){
  $("#background").load('bg.html');
})
