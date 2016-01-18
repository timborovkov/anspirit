<?php
  header("Content-Type: text/javascript");

  $mysqli = new mysqli('localhost','root','junction2015','qproject');

  if(isset($_POST['voiceRequest'])){
    //Give back voice anwser, (action) and react on server side...
    //will get from user POST voiceRequest, userID, userPosition
    //User request can contain search query or voice command
    //  1. Is it command or query
    //  2. If command you just have to react on it with correct position and previous request
    //      2 1. command can be device control command
    //      2 2. or command can be something like facebook status update
    //  3. If it was query you must search on wikipedia and read data from there and you must know previous request
    //  4. If not on wikipedia, you can just ask google for anwser... As stock prices, news etc.
    //  5. Also user can ask something stupid as How are you? or What is your name?
    echo(json_encode(array("error"=>"function not yet available", "fix"=>"wait till developers will fix issue")));
  }else if(isset($_POST['imageRequest'])){
    //Give back image content description and react if needed
    //Image could be as photo from Google Glass camera with image description needed
    //User can get to know what is he or she seeing and react on it if needed...
    echo(json_encode(array("error"=>"function not yet available", "fix"=>"wait till developers will fix issue")));
  }else if(isset($_POST['actionRequest'])){
    //Give back (action) and react on server side...
    //will get from user POST actionRequest, userID, userPosition
    //action can be like door opened or user is pointing lamp
    //In this case  you have to turn this lamp on etc.
    //Or turn on lights in the room where user is
    echo(json_encode(array("error"=>"function not yet available", "fix"=>"wait till developers will fix issue")));
  }else if(isset($_POST['positionRequest'])){
    //Actions when user is in current position and position name
    //will get from user POST positionRequest, userID
    //User is home, user went to work, user is out etc.
    //All of these need reactions from server but no clear voice anwser as in first case
    echo(json_encode(array("error"=>"function not yet available", "fix"=>"wait till developers will fix issue")));
  }else{
    echo(json_encode(array("error"=>"no input data", "fix"=>"send input data as post")));
  }

 ?>
