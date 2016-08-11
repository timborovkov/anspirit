$(document).ready(function(){
  //Home
  onAuthStateChanged(function(user){
    if(user != null){
      //Home screen
      $(".content").load('pages/home.html');
    }else{
      //Login
      $(".content").load('pages/sign_in.html');
    }
  });
});
