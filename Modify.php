<?php

include_once "./AI_mysql_config.php";

$result1= mysql_query("SELECT * FROM `stone_user` WHERE account='$_REQUEST[account]'", $link);
$rows=mysql_fetch_array($result1,MYSQL_ASSOC);

if( $rows )
{
	if( $rows['password'] == $_REQUEST['password'] )
	{
		mysql_query("UPDATE `stone_user` SET `password` = '$_REQUEST[npassword]' WHERE `stone_user`.`account` = '$_REQUEST[account]' AND `stone_user`.`password` = '$_REQUEST[password]'", $link);
		
		echo "Modification successes<br>2 seconds go back to login";
		echo "<html> <head> <meta http-equiv=refresh content=2;url=http://140.116.245.148/WebCourse/students/f74024070/project1/AI_login.html > </head> ";
	}
	else
	{
		echo "The information is wrong <br>Please try again <br>2 seconds to go back to modify";
		echo "<html> <head> <meta http-equiv=refresh content=2;url=http://140.116.245.148/WebCourse/students/f74024070/project1/AI_modify.html > </head> ";
	}
}
else
{
	echo "The information is wrong <br>Please try again <br>2 seconds to go back to modify";
	echo "<html> <head> <meta http-equiv=refresh content=2;url=http://140.116.245.148/WebCourse/students/f74024070/project1/AI_modify.html > </head> ";
}

?>
