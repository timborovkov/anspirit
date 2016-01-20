<?php
header("Content-Type: text/javascript");

$returnArray = null;
$id = $_GET['id'];
$mysqli = new mysqli('localhost','root','junction2015','qproject');
$query = "SELECT * FROM `users` WHERE `id`='".$id."'";
  if($result = $mysqli -> query($query)){
    $row = $result -> fetch_assoc();
    $returnArray = array('id'=>$id, 'name'=>$row['fullname'], 'email'=>$row['email'], 'age'=>$row['age'], 'version'=>$row['version'], 'lang'=>$row['lang']);
  }else{
    $returnArray = array('error'=>'error');
  }

echo json_encode($returnArray);

?>