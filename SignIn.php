<?php

include_once "./AI_mysql_config.php";

$query="SELECT * FROM `stone_user` ";
$result= mysql_query($query,$link) or   die ("Error in query: $query.". mysql_error());;


if($_REQUEST['account']){

	if(vaild($_REQUEST['account'],$_REQUEST['password'],$link)){
	
		$result= mysql_query("SELECT * FROM `stone_user` WHERE account='$_REQUEST[account]'", $link);
		$rows= mysql_fetch_array($result,MYSQL_ASSOC);
		
		setcookie("account",$rows['account']);
		echo "Login successes! <br>2 seconds go to AI_test";
		echo "<html> <head> <meta http-equiv=refresh content=2;url=http://140.116.245.148/WebCourse/students/f74024070/project1/index.php > </head> ";

		exit;
	}
	else
	{ 		
		echo "Login fails! <br>Please try again!<br>2 seconds go back to login";
		echo "<html> <head> <meta http-equiv=refresh content=2;url=http://140.116.245.148/WebCourse/students/f74024070/project1/AI_login.html > </head> ";
	}
}

function vaild($account,$password,$link){
	if($account and $password){
		$result= mysql_query("SELECT * FROM `stone_user` WHERE account='$account'", $link);
		if($rows= mysql_fetch_array($result,MYSQL_ASSOC)){
			if($rows['password'] == $password){	return 1;  }
		}
	}
	return 0;
}

?>
