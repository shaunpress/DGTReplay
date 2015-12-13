<?php
    if ($_POST["tournament_id"])
    {
        $tournament_id = $_POST['tournament_id'];
    }
    if ($_POST["round_no"])
    {
        $round_no = $_POST['round_no'];
    }
    if ($_POST["board_no"])
    {
        $board_no = $_POST['board_no'];
    }
    if ($_POST["pos_text"])
    {
        $pos_text = $_POST['pos_text'];
    }
    if ($_POST["game_text"])
    {
        $game_text = $_POST['game_text'];
    }
    
    echo $tournament_id,$round_no,$board_no,$pos_text,$game_text;
    $con=mysqli_connect("localhost","dgtreplay","dgtsystem","livegames");

    // Check connection
    if (mysqli_connect_errno())
    {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    // Check to see if entry already exists


    $where = " where tournament_id = ".$tournament_id;
    $where = $where." and round_no = ".$round_no." and board_no = ".$board_no;
    $query = "select * from gameinfo".$where;

    echo $query;
    $result = mysqli_query($con,$query);
    if (mysqli_num_rows($result)) {
        echo "Update";
        $result->close();
        $update_string = "update gameinfo set pos_text='".$pos_text."',game_text='".$game_text."' ";
        $query = $update_string.$where;
    } else {
        echo "Insert";
        $insert_string = "insert into gameinfo (tournament_id,round_no,board_no,pos_text,game_text) ";
        $insert_string .= "values (".$tournament_id.",".$round_no.",".$board_no.",'".$pos_text;
        $insert_string .= "','".$game_text."')";
        $query = $insert_string;
    }
    echo $query;
    $result = mysqli_query($con,$query);

    mysqli_close($con);

?>
