<?php
require("../../sqlConnect.php");
//require("../cleanAJAX.php");

require_once "cleanRequests.php";


$institute    = $_POST['institute'];
$country_id   = $_POST['country_id'];
$country_name = $_POST['country_name'];

$sql = "SELECT * FROM `institutions` WHERE `institute`='$institute'";
$result = $conn->query($sql);

if($result -> num_rows > 0){
  echo "institute already listed";
} else {
  $sql = "INSERT INTO `institutions` (`country`,`code`,`institute`) VALUES ('$country_name','$country_id','$institute')";
  if ($conn->query($sql) === TRUE) {
    echo "success";
    //send basic e-mail to me to ask to check 
    
    $to = "anthony.haffey@gmail.com";
    $subject = "A new institute has/is trying to be registered";
    $txt = "Check your mysql table for institutes, someone has put themself down as being a member of a new institute";    
    mail($to,$subject,$txt); 
    
  } else {
    echo  $conn->error;;
  }  
}
?>