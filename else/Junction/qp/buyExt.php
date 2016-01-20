<?php
  header("Content-Type: text/javascript");
  $toRet = array('nothingToDo'=>true);
  $mysqli = new mysqli('localhost','root','junction2015','qproject');

  if(isset($_GET['user'])){
    $user = $_GET['user'];
    if($_GET['free'] == 'false'){
      //Will start payment process and give some data about payment
      //Server will now accept payments...
      //ext, user, free
      $result = $mysqli -> query("SELECT * FROM `extensions` WHERE `id` = ".$_GET['ext']);
      if($result != null && $result->num_rows > 0){
        if($ext = $result -> fetch_assoc()){
          $toRet = array();
          if($ext['price'] <= 0){
            $toRet['toPay'] = 0;
          }else{
            $toRet['toPay'] = $ext['price'];
            $toRet['paymentCode'] = md5(rand());
            if($result = $mysqli -> query("INSERT INTO `payments` (`paymentCode`, `paymentType`, `from`, `buyWhat`) VALUES ('".$toRet['paymentCode']."','buyExt',".$user.", ".$_GET['ext'].")")){
              $toRet['done'] = true;
            }else{
              $toRet['done'] = false;
            }
          }
          $toRet['extensionName'] = $ext['name'];
        }
      }
    }else if($_POST['paymentDone'] == 'true'){
      //paymentCode, paymentDone, user
      //Payment is done and accepted
      //Extension will be set as purchased if payment form this user with this payment code was accepted and DATABASE['done'] == false
      $paymentCode = $_POST['paymentCode'];
      $first_result = $mysqli -> query("SELECT * FROM `payments` WHERE `paymentCode` = ".$paymentCode);
      if($result -> num_rows > 0){
        $result = $mysqli -> query("UPDATE `payments` SET `done`=true WHERE `paymentCode` = ".$paymentCode);
        if($result = $mysqli -> query("SELECT * FROM `userExtensions` WHERE `userId` = " . $user)){
          $row = $result->fetch_assoc();
          $array = unserialize($row['extensions']);
          $payment = $first_result -> fetch_assoc();
          array_push($array, $payment['buyWhat']);
          $array = serialize($array);
          $query = "UPDATE `userExtensions` SET `extensions` = '". $array ."' WHERE `userId` = " . $user;
          if($mysqli -> query($query)){
            if($result = $mysqli -> query("SELECT * FROM `extensions` WHERE `id` = ".$payment['buyWhat'])){
                if($ext = $result -> fetch_assoc()){
                   if($mysqli -> query("UPDATE `extensions` SET `soldTimes`=". $ext['soldTimes'] + 1 ." WHERE `id` = ".$payment['buyWhat'])){
                    $toRet = array('done'=>true);
                   }
                }
            }
          }
        }
      }
    }else if($_GET['free'] == 'true'){
      //free, user and ext
      //If extension was free user don't have to pay and Server will
      //set it as purchased.
      //If everything is OK, server will return done=>true
      if(free($_GET['ext'])){
       if($result = $mysqli -> query("SELECT * FROM `userExtensions` WHERE `userId` = " . $user)){
          $row = $result->fetch_assoc();
          $array = unserialize($row['extensions']);
          $payment = $first_result -> fetch_assoc();
          array_push($array, $_POST['ext']);
          $array = serialize($array);
          if($mysqli -> query("UPDATE `userExtensions` SET `extensions` = '". $array ."' WHERE `userId` = " . $user)){
            if($result = $mysqli -> query("SELECT * FROM `extensions` WHERE `id` = ".$payment['buyWhat'])){
                if($ext = $result -> fetch_assoc()){
                   if($mysqli -> query("UPDATE `extensions` SET `soldTimes`=". $ext['soldTimes'] + 1 ." WHERE `id` = ".$payment['buyWhat'])){
                    $toRet = array('done'=>true);
                   }
                }
            }
          }
        }
      }
    }
  }

  function free($ext){
    return true;
  }

  echo json_encode($toRet);


?>
