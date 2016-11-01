<?php
$host="140.116.245.148";
$root="f74024070";
$upwd="play25sam24";
$db="f74024070";

$link=mysql_connect($host,$root,$upwd) or die ("Unable to connect!");
mysql_select_db($db, $link) or die ("Unable to select database!");
?>