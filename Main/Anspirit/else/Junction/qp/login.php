<?php
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
  } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
      $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
  } else {
      $ip = $_SERVER['REMOTE_ADDR'];
  }

  $pass = $_POST['password'];
  $email = $_POST['email'];
  $login = false;
  $id = 0;
  $version = "";
  $name = "";
  $age = 0;
  $lang = 'en';

  header("Content-Type: text/javascript");
  $mysqli = new mysqli('localhost','root','junction2015','qproject');
  $query = "SELECT * FROM `users` WHERE `email` = '" . $email . "'";
  $result = $mysqli -> query($query);
  if($result != null){
    while($row = $result -> fetch_assoc()){
      if($row['password'] == md5($pass)){
        $login = true;
        $id = $row['id'];
        $version = $row['version'];
        $name = $row['fullname'];
        $age = $row['age'];
        $lang = $row['lang'];
        $tokenCode = $row['tokenCode'];
      }
    }
  }
  $mysqli -> query("INSERT INTO `tryToLogin`(`email`, `date`, `ip`) VALUES ('".$email."', NOW(), '".$ip."')");

  $data = array('login'=> $login, 'id'=> $id, 'version'=> $version, 'lang'=> $lang, 'name'=>$name, 'age'=>$age, 'tokenCode'=>$tokenCode, 'email'=>$email);
  $data = json_encode($data);
  echo($data);

  $mysqli -> close();
?>