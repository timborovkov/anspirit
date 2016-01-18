<?php
  header("Content-Type: text/javascript");
  $user = $_GET['user'];
  $mysqli = new mysqli('localhost','root','junction2015','qproject');
  $query = "SELECT * FROM `userExtensions` WHERE `userId` = " . $user;
  if($result = $mysqli -> query($query)){

    $row = $result->fetch_assoc();
    $array = unserialize($row['extensions']);

    if(isset($_GET['new'])){
        array_push($array, $_GET['extID']);
        $array = serialize($array);
        $query = "UPDATE `userExtensions` SET `extensions` = '". $array ."' WHERE `userId` = " . $user;
        if($mysqli -> query($query)){
          echo("{'done':true}");
        }else{
          echo("{'error':true}");
        }
    }else if(isset($_GET['delete'])){
        if(($key = array_search($_GET['extID'], $array)) !== false){
          unset($array[$key]);
        }
        $array = serialize($array);
        $query = "UPDATE `userExtensions` SET `extensions` = '". $array ."' WHERE `userId` = " . $user;
        if($mysqli -> query($query)){
          echo("{'done':true}");
        }else{
          echo("{'error':true}");
        }
    }else{
        $toRet = array();
        foreach ($array as $extID){
          $query = "SELECT * FROM `extensions` WHERE `id` = " . $extID;
          if($result = $mysqli -> query($query)){
            if($ext = $result -> fetch_assoc()){
              array_push($toRet, $ext);
            }
          }
        }
        echo(json_encode($toRet));
    }
  }else{
    echo("{'error':true}");
  }
?>
