var HtmlDGT = window.HtmlDGT || {};
HtmlDGT.ui = (function($){
    var ui_board;
    var ui_engine;
    var ui = {
        SQUARE_WIDTH : 50,
        SQUARE_HEIGHT : 50,
        init :function(board) {
            $("#start-game").click(function() {
                board.startGame();
                var fenString = board.getFenFromBoard(board.getSquares());
                ui_engine.run_engine(fenString);
            });
            $("#prev-move").click(function() {
                board.previousMove();
                var fenString = board.getFenFromBoard(board.getSquares());
                ui_engine.run_engine(fenString);
            });
            $("#next-move").click(function() {
                board.nextMove();
                var fenString = board.getFenFromBoard(board.getSquares());
                ui_engine.run_engine(fenString);
            });
            $("#end-game").click(function() {
                board.endGame();
                var fenString = board.getFenFromBoard(board.getSquares());
                ui_engine.run_engine(fenString);
            });
            $("#output_box").click(function() {
                ui_engine.toggleEngine();
            });
        },
        drawBoard : function(board){
            var rows = board.getSquares();
            var boardArea = $("#board");
            for (var i=0;i<rows.length;i++) {
                var row = rows[7-i];
                for (var j=0;j<row.length;j++) {
                    var square = row[j];
                    var square_div = square.getDiv();
                    boardArea.append(square_div);
                    var left = j*ui.SQUARE_WIDTH;
                    var top = i*ui.SQUARE_HEIGHT;
                    square_div.css({
                        left:left,
                        top:top
                    });
                };
                boardArea.append("<br>");
            };
        },
        updatePlayerList: function(board) {
            var playerDetails = board.getPlayers();
            var gameDetails = board.getGames();
            $("#game_list").empty();
            for (var i=0;i<playerDetails.length;i++) {
                var buttonText = this.parsePlayerInfo(playerDetails[i]);
                var new_button = $('<input type ="button" class="game_button" value="'+buttonText+'"/><br>');
                new_button.attr('game_no',i);
                new_button.click(function() {
                    var gameNo = parseInt($(this).attr('game_no'),10);
                    ui_board.updateInfo(gameNo);
                    ui_board.showGame(gameNo,-1);
                    var fenString = board.getFenFromBoard(board.getSquares());
                    ui_engine.run_engine(fenString);
                    
                });
                $("#game_list").append(new_button);
            }
            this.updateInfoBox(playerDetails,gameDetails,-1);
        },
        clearInfoBox : function() {
            $("#black_name").empty();
            $("#white_name").empty();
            $("#move_list").empty();
        },
        updateInfoBox: function(infoText,infoGame,gameNum) {
            if (gameNum == -1) {
                gameNum = ui_board.getCurrentGame();
            }
            this.clearInfoBox();
            var playerData = infoText[gameNum].split("<");
            var gameData = HtmlDGT.File.parseMoves(infoGame[gameNum]);
            var moveList = this.parseMoves(gameData);
            $("#black_name").append(playerData[8].substring(2));
            $("#white_name").append(playerData[7].substring(2));
            // $("#move_list").append(moveList);
        },
            
        parsePlayerInfo: function(playerDetails) {
            var playerData =  playerDetails.split("<");
            var ret_string = playerData[7].substring(2)+" - ";
            ret_string += playerData[8].substring(2)+" (";
            ret_string += playerData[9].substring(2)+" ) ";
            ret_string += playerData[4].substring(0,playerData[4].length-1);
            return ret_string;
        },
        parseMoves : function(moveData) {
            var retString = $();
            var totalMoves = (moveData.length-4)/2;
            for (var i=0; i<totalMoves;i+=2){
                var next_line = ($('<div class="move_line">'));
                next_line.append(''+(i/2+1)+'.');
                for (var j=0;j<2;j++) {
                    var new_move = $('<div class="move" move_no="'+(i+j)+'">'+moveData[(i+j)*2+2]+'</div>');
                    new_move.click(function() {
                        $(".move").css("background-color","");
                        $(this).css("background-color","#53a6d7");
                        var moveNo = parseInt($(this).attr('move_no'),10);
                        ui_board.showGame(-1,moveNo+1);
                        var fenString = ui_board.getFenFromBoard(ui_board.getSquares());
                        ui_engine.run_engine(fenString);
                    });
                    next_line.append(new_move);
                }
                next_line.append($('</div>'));
                $("#move_list").append(next_line);
            }
            return retString;
        }
                
                
                
    };
    ui.setBoard = function(board,engine) {
        ui_board = board;
        if (engine !== undefined)
            ui_engine = engine;
        ui_engine.setPgne(ui_board.getPgne());
    };
    return ui;
})(jQuery);
    
              
                