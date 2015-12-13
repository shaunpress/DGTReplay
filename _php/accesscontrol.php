<?php // accesscontrol.php

include_once 'common.php';
include_once 'db.php';

session_start();
if (isset($_SESSION['uid'])!="") {
    $uid = $_SESSION['uid'];
    $pwd = md5($_SESSION['pwd']);
} else if (!empty($_POST['uid'])) {
    $uid =  $_POST['uid'];
    $pwd =  md5($_POST['pwd']);
    echo $pwd;
}

if(!isset($uid)) {
    ?>
    <!DOCTYPE html PUBLIC "-//W3C/DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <title> Please Log In for Access </title>
    <meta http-equiv="Content-Type"
    content="text/html; charset=iso-8859-1" />
    </head>
    <body>
    <h1> Login Required </h1>
    <p>You must log in to access this area of the site. If you are
    not a registered user, <a href="../registration.php">click here</a>
    to sign up for instant access!</p>
    <p><form method="post" action="<?=$_SERVER['PHP_SELF']?>">
    User ID: <input type="text" name="uid" size="8" /><br />
    Password: <input type="password" name="pwd" SIZE="8" /><br />
    <input type="submit" value="Log in" />
    </form></p>
    </body>
    </html>
    <?php
    exit;
    }
dbConnect("livegames");
$sql = "SELECT * FROM user WHERE
userid = '$uid' AND password = '$pwd'";
$result = mysql_query($sql);
if (!$result) {
    error('A database error occurred while checking your '.
    'login details.\nIfhis error persists, please '.
    'contact you@example.com.');
}
if (mysql_num_rows($result) == 0) {
    unset($_SESSION['uid']);
    unset($_SESSION['pwd']);
    ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <title> Access Denied </title>
    <meta http-equiv="Content-Type"
    content="text/html; charset=iso-8859-1" />
    </head>
    <body>
    <h1> Access Denied </h1>
    <p>Your user ID or password is incorrect, or you are not a
    registered user on this site. To try logging in again, click
    <a href="<?=$_SERVER['PHP_SELF']?>">here</a>. To register for instant
    access, click <a href="../registration.php">here</a>.</p>
    </body>
    </html>
    <?php
    exit;
} else {
    $row = mysql_fetch_row($result);
    $userNo = $row[0];
}
?>
