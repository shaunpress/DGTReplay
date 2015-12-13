<?php

  $whereString = "";

  if (isset($_GET["tournament"])) {
    $tournament = htmlspecialchars($_GET["tournament"]);
    if ($tournament != "0")
        $whereString = "tournament_id = ".$tournament;
  } 
  if (isset($_GET["round"])) {
    $round = htmlspecialchars($_GET["round"]);
    if ($round != "0") {
        if ($whereString != "") {
            $whereString .= " and ";
        }
        $whereString .= "round_no = ".$round;
    }
  }
  if (isset($_GET["board"])) {
    $board = htmlspecialchars($_GET["board"]);
    if ($board != "0") {
        if ($whereString != "") {
            $whereString .= " and ";
        }
        $whereString .= "board_no = ".$board; 
    }
  }

  $con=mysqli_connect("localhost","dgtreplay","dgtsystem","livegames");

  // Check connection
  if (mysqli_connect_errno())
  {
   echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

  $query = "select * from gameinfo";
  if ($whereString != "") {
      $query = $query." where ".$whereString;
  }

  $result = mysqli_query($con,$query);

  $rows = array();
  while($r = mysqli_fetch_assoc($result)) {
    $rows[] = $r;
  }
  echo json_encode($rows);
  // var_dump($rows);

  mysqli_close($con);
?>