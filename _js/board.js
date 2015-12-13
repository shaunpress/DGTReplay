var HtmlDGT = window.HtmlDGT || {};
HtmlDGT.Board = function($){
    var NUM_ROWS = 8;
    var NUM_COLS = 8;
    var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    var gameInfo = [];
    var gameMoves = [];
    var currentMove = 0;
    var currentGame = 0;
    
    var Board = function() {
        var that = this;
        var gameFlags = "KQkq"
        var squares = createLayout();
        var pgne = HtmlDGT.PGNE();
        pgne.resetBoard();
        this.getSquares = function() { return squares;};
        this.getCurrentGame = function() { return currentGame };
        this.updateSquares = function(startSq,endSq,pieceSymbol,transmitMove){
            var promotePiece = null;
            var movePiece = squares[7-Math.floor(startSq/8)][startSq % 8].getSquarePiece();
            if (movePiece.toLowerCase() == 'p' && movePiece !== pieceSymbol) {
                alert(pieceSymbol);
                promotePiece = pieceSymbol.toLowerCase();
            }
            squares[7-Math.floor(startSq/8)][startSq % 8].clearSquare();
            squares[7-Math.floor(endSq/8)][endSq % 8].clearSquare();
            squares[7-Math.floor(endSq/8)][endSq % 8].setPieceWithChar(pieceSymbol);
            if (transmitMove == undefined)
                pgne.playDGTMove(startSq,endSq,promotePiece);
        }
        
        this.getPgne = function() {
            return pgne;
        }
        this.clearSquares = function(startSq) {
            squares[7-Math.floor(startSq/8)][startSq % 8].clearSquare();
        }
        this.makeMove = function(moveToken) {
            // Coverts moveToken into a move
            // and plays it on the board
            var tokenLen = moveToken.length;
            var sepIndex = moveToken.lastIndexOf(".");
            var castleIndex = moveToken.search(/rk|kr/i);
            if (castleIndex > -1) {
                // Handle castling
                sepIndex = moveToken.indexOf(".");
                if (castleIndex > sepIndex+1) {
                    // an offset between sperator and pieces
                    if (sepIndex == 0) {
                        // Castle long
                        var startSq = 4; // hack to swap rook sq with king sq
                    } else {
                        var startSq = parseInt(moveToken.substring(0,sepIndex),10)+4;
                    }
                    this.updateSquares(startSq-4,startSq-1,moveToken[castleIndex+1],false);
                    var endSq = startSq-2;
                    var pieceType = moveToken[castleIndex];
                } else {
                    var startSq = parseInt(moveToken.substring(0,sepIndex),10);
                    this.updateSquares(startSq+3,startSq+1,moveToken[sepIndex+1],false);
                    var endSq = startSq+2;
                    var pieceType = moveToken[sepIndex+2];
                }
            } else {
                if (sepIndex == tokenLen-1) {
                    
                    // . is at end
                    var pieceIndex = moveToken.search(/[a-zA-z]/);
                    
                    if (pieceIndex == 0) {
                        // End Sq is 0 
                        var endSq = 0;
                    } else {
                        var endSq = parseInt(moveToken.substring(0,pieceIndex),10);
                    }
                    if (pieceIndex == sepIndex-1) {
                         var offSet = 0;
                    } else {
                        var offSet = parseInt(moveToken.substring(pieceIndex+1,sepIndex),10);
                    }
                    var startSq = endSq + offSet +1;
                    if (moveToken[sepIndex-1] == ".") {
                        // enpas eg <17P7..>
                        this.clearSquares(startSq+1);
                    }
                        
                    var pieceType = moveToken[pieceIndex];
                } else {
                    var pieceIndex = moveToken.search(/[a-zA-z]/);
                    if (sepIndex == 0) {
                        var startSq = 0;
                    } else {
                        var startSq = parseInt(moveToken.substring(0,sepIndex),10);
                    }
                    if (pieceIndex == sepIndex+1) {
                        var offSet = 0;
                    } else {
                        var offSet = parseInt(moveToken.substring(sepIndex+1,pieceIndex),10);
                    }
                    var endSq = startSq+offSet+1;
                    var pieceType = moveToken[pieceIndex];
                }
            }
            this.updateSquares(startSq,endSq,pieceType);
        }
        this.resetGame = function() {
            $(".square").find("img").remove();
        };
        this.showGame = function(gameNo,endMove) {
            if (gameNo == -1) {
                gameNo = currentGame;
            }
            currentGame = gameNo;
            this.resetGame();
            pgne.resetBoard();
            updateFromFen(squares,START_FEN);
            var gameData = HtmlDGT.File.parseMoves(gameMoves[currentGame]);
            var totalMoves = (gameData.length-4)/2;
            if (endMove != -1) {
                if (endMove > totalMoves) {
                    currentMove = totalMoves;
                } else {
                    totalMoves = endMove;
                    currentMove = endMove;
                }
            } else {
                currentMove = totalMoves;
            }
            for (var i =0;i<totalMoves;i++) {
                this.makeMove(gameData[i*2+3]);
            }
            $(".move").css("background-color","");
            $("[move_no='"+(currentMove-1)+"']").css("background-color","#53a6d7");
                        var scrollPos = $("#move_list").scrollTop()-200;
            $("#move_list").scrollTop($("[move_no='"+
                                        (currentMove-1)+"']").position().top+scrollPos);

        };
        
        this.updateFromQuery = function(queryData,gameNumber) {
            if (gameNumber == -1) {
                gameNumber = currentGame;
            }
            currentGame = gameNumber;
            var gameArray = JSON.parse(queryData);
            gameMoves = [];
            gameInfo = [];
            for (var i=0;i<gameArray.length;i++) {
                gameMoves.push(gameArray[i].pos_text);
                gameInfo.push(gameArray[i].game_text);
            }
        };
        
        this.updateFromFile = function(gameNumber) {
            currentGame = gameNumber;
            var gameDetails = HtmlDGT.File.getGames();
            var playerInfo = HtmlDGT.File.getPlayers();
            gameMoves = gameDetails;
            gameInfo = playerInfo;
            var gameData = HtmlDGT.File.parseMoves(gameDetails[gameNumber]);
            var totalMoves = (gameData.length-4)/2;
            currentMove = totalMoves;
            for (var i =0;i<totalMoves;i++) {
                this.makeMove(gameData[i*2+3]);
            }
        };
        this.startGame = function() {
            this.resetGame();
            updateFromFen(squares,START_FEN);
            currentMove = 0;
            $(".move").css("background-color","");
            $("[move_no='"+(currentMove-1)+"']").css("background-color","#53a6d7");
            var scrollPos = $("#move_list").scrollTop()-200;
            $("#move_list").scrollTop($("[move_no='"+
                                        1+"']").position().top+scrollPos);
        };
        this.previousMove = function() {
            if (currentMove > 0) {
                currentMove--;
            }
            this.showGame(currentGame,currentMove);
            $(".move").css("background-color","");
            $("[move_no='"+(currentMove-1)+"']").css("background-color","#53a6d7");
            var scrollPos = $("#move_list").scrollTop()-200;
            $("#move_list").scrollTop($("[move_no='"+
                                        (currentMove-1)+"']").position().top+scrollPos);
        };
        this.nextMove = function() {
            currentMove++;
            this.showGame(currentGame,currentMove);
            $(".move").css("background-color","");
            $("[move_no='"+(currentMove-1)+"']").css("background-color","#53a6d7");
            var scrollPos = $("#move_list").scrollTop()-200;
            $("#move_list").scrollTop($("[move_no='"+
                                        (currentMove-1)+"']").position().top+scrollPos);
        }
        this.endGame = function() {
            this.showGame(currentGame,-1);
            $(".move").css("background-color","");
            $("[move_no='"+(currentMove-1)+"']").css("background-color","#53a6d7");
            var scrollPos = $("#move_list").scrollTop()-200;
            $("#move_list").scrollTop($("[move_no='"+
                                        (currentMove-1)+"']").position().top+scrollPos);
        };
        this.updateInfo = function(gameNo) {
            if (gameNo == -1) {
                gameNo = currentGame;
            } else {
                currentGame = gameNo;
            }
            HtmlDGT.ui.updateInfoBox(gameInfo,gameMoves,gameNo);
        };
        this.getPlayers = function() {
            return gameInfo;
        };
        this.getGames = function() {
            return gameMoves;
        };
        this.getFenFromBoard = function(squares) {
            return pgne.getFen();
            
            var fenString = "";
            var blankCount = 0;
            for (var i = NUM_ROWS-1;i>=0;i--) {
                for (var j = 0;j<NUM_COLS;j++) {
                    var pieceChar = squares[i][j].getSquarePiece();
                    if (pieceChar == ' ') 
                        blankCount++;
                    else {
                        if (blankCount > 0) {
                            fenString += blankCount.toString();
                            blankCount = 0;
                        }
                        fenString += pieceChar;
                    } 
                }
                if (blankCount > 0) 
                    fenString += blankCount.toString();
                blankCount = 0;
                fenString += '/';
            }
            var toMove = ' w';
            if (currentMove % 2 == 1) 
                toMove = ' b';
                
            fenString += toMove+" - - 0 1";
            
            return fenString;
        }
        
        return this;
    };
    var createLayout = function(){
        var squares = [];
        for (var i = 0; i < NUM_ROWS;i++) {
            var col = [];
            for (var j=0; j<NUM_COLS;j++) {
                var square = HtmlDGT.Square.create(i,j,' ',' ');
                col[j] = square;
            };
            squares.push(col);
        };
        updateFromFen(squares,START_FEN);
        return squares;
    };
    
    var resetSquares = function(squares) {
        for (var i=0;i<NUM_ROWS;i++) {
            for (var j=0; j<NUM_COLS;j++) {
                squares[i][j].clearSquare();
            }
        }
    }
    var updateFromFen = function(squares,fenString) {
        var rows = fenString.split('/');
        var currentRow = NUM_ROWS;
        
        resetSquares(squares);
        
        for (var i=0;i<NUM_ROWS;i++) {
            var sq = rows[i].split('');
            var cols = 0;
            currentRow--;
            for (var j=0;j<sq.length;j++) {
                if (sq[j].search(/[1-8]/) !== -1) {
                    cols += parseInt(sq[j],10);
                } else {
                    var piece = sq[j];
                    if (piece == piece.toLowerCase()) {
                        squares[currentRow][j].setPiece('b',piece.toUpperCase());
                    } else {
                        squares[currentRow][j].setPiece('w',piece.toUpperCase());
                    }
                }
            }
        }
    };
    
    
                    
    return Board;
}(jQuery);