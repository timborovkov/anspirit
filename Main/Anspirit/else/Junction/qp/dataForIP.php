<?php
    header("Content-Type: text/javascript");
    $toRet = array('error'=>true);
    if(isset($_GET['setData'])){
       $data = serialize($_GET);
       setcookie('data', $data);
       $toRet = array('done'=>true, 'data'=>$data);
    }else{
      $toRet = array('no' => true);
    }
  echo json_encode($toRet);
?>
