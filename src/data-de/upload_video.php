<?php
    $time = date("Y-m-d-H-i-s");
    $target_path = "uploads/" . basename("gafo-de" . $_FILES["vidfile"]["name"] . "-" . $time . ".webm");
    move_uploaded_file($_FILES["vidfile"]["tmp_name"], $target_path );
?>