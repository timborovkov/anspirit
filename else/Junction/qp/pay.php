<?php
  $data = getData();
  $price =  $data['price'];
  $ext =  $data['ext'];
  $user =  $data['user'];

  if(isset($_POST['stripeToken'])){
    $token = $_POST['stripeToken'];
    $mysqli = new mysqli('localhost','root','junction2015','qproject');
    if($result = $mysqli->query("SELECT * FROM `payments` WHERE `done` = false AND `from` = '$user'")){
    if($result->num_rows > 0){
      if($result = $mysqli -> query("UPDATE `payments` SET `stripeToken`='$token', `done`=true WHERE `done` = false AND `from` = $user")){
        //exit this window
        echo('<h1>Done, please close this window</h1>');
      }else{
        echo('<h1>Error, please try again later</h1>');
      }
    }else{
      echo('<h1>Error, No such order has been seen...</h1>');
    }
  }
  }else{
    //Start payment

    echo " <!DOCTYPE html>
    <html>
    <head>
      <title>Pay</title>
    </head>
    <body style='background-color: rgb(236,236,236);'>
      <table align='center'><tr><td>
      <form action='' method='POST'>
        <script
          src='https://checkout.stripe.com/checkout.js' class='stripe-button'
          data-key='pk_test_DmVThjuv0aKSquqfP9jQgS9C'
          data-amount= $price
          data-name= '$ext'
          data-description='Buy extension, $ext'
          data-image='./q-icon-black-lg.png'
          data-locale='auto'>
        </script>
      </form>
      </td></tr></table>
    </body>
    </html>
    ";
  }

  function getData(){
    $resp = $_COOKIE['data'];
    return unserialize($resp);
  }
?>
