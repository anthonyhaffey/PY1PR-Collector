<?php

require("../../sqlConnect.php");
require_once "cleanRequests.php";

//print_r($_POST);
$country_id   = $_POST['country_id'];
$country_name = $_POST['country_name'];

$sql = "SELECT * FROM `participant_countries` WHERE `code`='$country_id'";
$result = $conn->query($sql);

//print_r($result);
if($result -> num_rows > 0){
  $sql = "UPDATE `participant_countries` `country_table` SET country_table.frequency = country_table.frequency + 1 WHERE `country` = '$country_name'"; 
} else {
  $sql = "INSERT INTO `participant_countries` (`country`,`code`,`frequency`) VALUES ('$country_name','$country_id',1)";  
}
if ($conn->query($sql) === TRUE) {
  echo "success";				
} else {
  echo  $conn->error;;
}

?>