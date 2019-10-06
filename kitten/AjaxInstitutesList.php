<?php

require("../../sqlConnect.php");
require_once "cleanRequests.php";

$sql = "SELECT * FROM `institutions`";
$result = $conn->query($sql);
$institutions_array = [];
while($row = $result->fetch_assoc()) {
  array_push($institutions_array,$row['institute']);
}

echo json_encode($institutions_array);

?>