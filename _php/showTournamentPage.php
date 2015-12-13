<?php

  $con=mysqli_connect("localhost","dgtreplay","dgtsystem","livegames");

  // Check connection
  if (mysqli_connect_errno())
  {
   echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

  echo "<h1>Tournaments</h1><br>";
  echo "<table id='tournament-table'><tbody>";
  $query = "select * from tournamentinfo";

  $result = mysqli_query($con,$query);

  while($r = mysqli_fetch_array($result)) {
    echo "<tr><td><a href='http://localhost/htmldgt/index.html?tournament=".$r['tournament_id']."'>".$r['tournament_name']."</a></td></tr>";
  }
  // var_dump($rows);
  echo "</tbody></table>";

  mysqli_close($con);
?>