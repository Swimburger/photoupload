<?php
require_once("inc.security.php");

$mysqli_connection = new mysqli("localhost", "photoupload", "photoupload", "photoupload");

mysqli_set_charset($mysqli_connection,"utf8");

if (mysqli_connect_errno()) echo "Failed to connect to MySQL: " . mysqli_connect_error() . "<hr />";
?>