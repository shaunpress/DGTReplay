<?php include 'accesscontrol.php'; ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title> Management Page </title>
<meta http-equiv="Content-Type"
content="text/html; charset=iso-8859-1" />
</head>
<body>
    <div id="header">Management Page</div>
    <div id="userdetails">
        User: <?php echo $uid; ?>
    </div>
    <div id="eventlist">
        Event List
        <?php
            $con=mysqli_connect("localhost","dgtreplay","dgtsystem","livegames");

          // Check connection
          if (mysqli_connect_errno())
          {
           echo "Failed to connect to MySQL: " . mysqli_connect_error();
          }

          echo "<h1>Tournaments</h1><br>";
          echo "<table id='tournament-table'><tbody>";
          $query = "select * from tournamentinfo where owner_id = '$userNo'";

          $result = mysqli_query($con,$query);

          while($r = mysqli_fetch_array($result)) {
            echo "<tr><td><a href='http://localhost/htmldgt/index.html?tournament=".$r['tournament_id']."'>".$r['tournament_name']."</a></td></tr>";
          }
          // var_dump($rows);
          echo "</tbody></table>";

          mysqli_close($con);
        ?>
        
    </div>
</body>
</html>    


