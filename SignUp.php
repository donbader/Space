<?php

include_once "./AI_mysql_config.php";

		//¤¤¤åoutput
		mysql_query("SET NAMES 'utf8'");
		mysql_query("SET CHARACTER_SET_CLIENT='utf8'");
		mysql_query("SET CHARACTER_SET_RESULTS='utf8'");

$result1= mysql_query("SELECT * FROM `stone_user` WHERE account='$_REQUEST[account]'", $link);
$rows=mysql_fetch_array($result1,MYSQL_ASSOC);

if( $rows )
{ 
	echo "The account has been used <br>Please try again <br>2 seconds to go back to register";
	echo "<html> <head> <meta http-equiv=refresh content=2;url=http://140.116.245.148/WebCourse/students/f74024070/project1/AI_register.html > </head> ";
}
else
{
	$result=mysql_query("INSERT INTO `stone_user` (`account`,`password`) VALUES ('$_REQUEST[account]','$_REQUEST[password]');", $link);
	echo "Register successes! <br>2 seconds go back to login";
	echo "<html> <head> <meta http-equiv=refresh content=2;url=http://140.116.245.148/WebCourse/students/f74024070/project1/AI_login.html > </head> ";
}
?>
