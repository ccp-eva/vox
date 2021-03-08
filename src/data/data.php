<?php
  // $jsonString = file_get_contents("php://input");
  $jsonString = $_POST['data'];
	$subjId = $_POST['subjId'];
  $time = date("Y-m-d-H-i-s");
  file_put_contents('gafo-' . $subjId . '-' . $time . '.json', $jsonString);
  echo '{ "success": true }';
?>