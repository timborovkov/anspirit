<?php
  $email = $_POST['email'];
  $pass = $_POST['password'];
  $name = $_POST['name'];
  $age = $_POST['age'];

  header("Content-Type: text/javascript");
  $mysqli = new mysqli('localhost','root','junction2015','qproject');
  $query = "SELECT * FROM `users` WHERE `email` = '" . $email . "'";
  $result = $mysqli -> query($query);
  if($result -> num_rows > 0){
    $r = array("done"=> false, "error"=>"User with this email already exist");
  }else{
    $query = "INSERT INTO `users`(`email`, `password`, `fullname`, `version`, `age`, 'tokenCode') VALUES ('".$email."','".md5($pass)."','".$name."','FREE','".$age."', ". md5(rand()) .")";
    $result = $mysqli -> query($query);
    if($result != null){
      $query = "SELECT * FROM `users` WHERE `email` = $email";
      $result = $mysqli -> query($query);
      if($result != null){
        $uid = $result -> fetch_assoc();
        $uid = $uid['id'];
        $extensions = array();
        $query = "INSERT INTO `userExtensions`(`userID`, `extensions`) VALUES ('".$uid."','".serialize($extensions)."')";
        $result = $mysqli -> query($query);
        
        if($result != null){
          $r = array("done"=> true);
        }else{
          $r = array("done"=> false, "error"=>"Server problem");
        }
      }else{
        $r = array("done"=> false, "error"=>"Server problem");
      }
    }else{
      $r = array("done"=> false, "error"=>"Server problem");
    }
  }
  echo json_encode($r);
  $mysqli->close();
?>