<?php
//header("Content-Type: text/javascript");

$giveAccess = false;

$valueToChange = $_POST['valueToChange'];
$newValue = $_POST['newValue'];
$userID = $_POST['userID'];
$tokenCode = $_POST['tokenCode'];

$mysqli = new mysqli('localhost','root','junction2015','qproject');
$query = "SELECT * FROM `users`";
$result = $mysqli -> query($query);

while($row = $result -> fetch_assoc()){
  if($row['id'] == $userID){
    if($row['tokenCode'] == $tokenCode){
      $giveAccess = true;
    }
  }
}
if($giveAccess == true){
  //change user data
  $query = "UPDATE `users` SET `". $valueToChange ."` = '". $newValue ."' WHERE `users`.`id` = " . $userID;
  if($mysqli -> query($query)){
    //done
    echo(json_encode(array('done'=>true)));
  }else{
    //error on server
    echo(json_encode(array('error'=>true)));
  }
}else{
  //access denied
  echo(json_encode(array('denied'=>true)));
}

?>