var HtmlDGT = window.HtmlDGT || {};
HtmlDGT.PGNE = function($) {
    
    var promotionsPieces = ['q','r','n','b'];
    var fileLabel = ['a','b','c','d','e','f','g','h'];
    
    var pawnDelta = {
    w: [16,15,17],
    b: [-16,-15,-17]
};
    var moveDelta = {
    n: [-18,-33,-31,-14,18,33,31,14],
    b: [-17,-15,17,15],
    r: [-16,-1,16,1],
    q: [-17,-16,-15,-1,17,16,15,1],
    k: [-17,-16,-15,-1,17,16,15,1]
};
    
    var last_rank = {
        w: 7,
        b: 0,
    }
    
    var second_rank = {
        w: 1,
        b: 6,
    }
    
    var PGNE = function() {
        var board = new Array(128);
        var to_move = 'w';
        var flags = {
            w: [true,true],
            b: [true,true],
            enpas: '-',
            moveCount: 1,
        }
        
        this.resetBoard = function() {
            board = new Array(128);
            to_move = 'w';
            this.makeFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
            //flags['w'] = [true,true];
            //flags['b'] = [true,true];
            //flags['enpas'] = '-';
            //flags['moveCount'] = 1;
            
        }
        
        
        this.validSquare = function(sq) {
            if (sq & 0x88) 
                return true;
            return false;
        }
        this.convertTox88 = function(sq64) {
            if (sq64 >= 0 && sq64 <= 63) {
                return (((7-(sq64 >> 3)) << 4) | (sq64%8));
            }
            return -1;
        }
        
        this.convertTo64 = function(sq88) {
            return (sq88 << 4)*8+(sq88 & 8);
        }
        this.numToSq = function(square) {
            return fileLabel[square%16]+((square>>4)+1);
        }
        
        this.getFenFlags = function() {
            // returns current FEN flags as string
            var resultString = "";
            if (flags['w'][0])
                resultString += "K";
            if (flags['w'][1])
                resultString += "Q";
            if (flags['b'][0])
                resultString += "k";
            if (flags['b'][1])
                resultString += "q";
            if (resultString == "")
                resultString += "-";
            
            resultString += " "+flags['enpas'] +" 0 "+flags['moveCount'];
            
            return " "+to_move+" "+resultString;
        }
        
        this.getMover = function() {
            return to_move;
        }
        
        this.setFen = function(fenString) {
            // alert("new Fen:"+this.getFen());
            for (var i=0;i<128;i++)
                board[i] = null;
            this.makeFromFen(fenString);
            // alert("updated Fen:"+this.getFen());
        }
        
        this.makeFromFen = function(fenString) {
            var fenItems = fenString.split(" ");
            var rows = fenItems[0].split('/');
            var currentRow = 8;

            for (var i=0;i<8;i++) {
                var square = rows[i].split('');
                var cols = 0;
                currentRow--;

                for (var j=0;j<square.length;j++) {
                    if (square[j].search(/[1-8]/) !== -1) {
                        var emptysquare = parseInt(square[j],10);

                        cols += emptysquare;
                    } else {
                        //var psquare = columns[j]+(8-i);
                        // alert(psquare);
                        //var piece_string = '<div class="piece"></div>';
                        var piece = square[j];
                        var new_piece;
                        if (piece == piece.toLowerCase()) {
                            new_piece = {type: piece.toLowerCase(), colour: "b"};
                        } else {
                            new_piece = {type: piece.toLowerCase(), colour: "w"};
                        }

                        // var new_piece = {type: square[j], colour: "w"};
                        // alert(square[j]);
                        var c_square = currentRow*16+cols;
                        board[c_square] = new_piece;
                        cols++;
                    }
                }
            }
            if (fenItems.length > 1) {
                to_move = fenItems[1];
                flags['w'][0] = false;
                flags['w'][1] = false;
                flags['b'][0] = false;
                flags['b'][1] = false;
                for (var k=0;k<fenItems[2].length;k++) {
                    if (fenItems[2][k] == 'K')
                        flags['w'][0] = true;
                    if (fenItems[2][k] == 'Q')
                        flags['w'][1] = true;
                    if (fenItems[2][k] == 'k')
                        flags['b'][0] = true;
                    if (fenItems[2][k] == 'q')
                        flags['b'][1] = true;
                }

                flags['moveCount'] = parseInt(fenItems[5]);

            }
            
        }
        
        this.getFen = function() {
            var resultString = "";
            for (var i = 7; i>=0; i--) {
                var j = 0;
                var count = 0;
                while (j<8) {
                    var sq = i*16+j;
                    if (board[sq] == null) {
                        count += 1;
                    } else {
                        if (count > 0) {
                            resultString += count;
                            count = 0;
                        }
                        if (board[sq].colour == 'w') {
                            resultString += board[sq].type.toUpperCase();
                        } else {
                            resultString += board[sq].type;
                        }
                    }
                    j += 1;
                }
                if (count > 0) {
                    resultString += count;
                }
                resultString += "/"
            }
            return resultString+this.getFenFlags();
        }
        
        
        this.playDGTMove = function(fromSq,toSq,promotePiece) {
            // Takes a single move from the DGT stream and updates the board
            var fromSq88 = this.convertTox88(fromSq);
            var toSq88 = this.convertTox88(toSq);
            var move = this.make_move(fromSq88,toSq88,promotePiece);
            this.playMove(move);
            
        }
        this.moveFromLan = function(token) {
            var startSq = (token[0].charCodeAt()-'a'.charCodeAt())+(token[1].charCodeAt()-'1'.charCodeAt())*16;
            var endSq = (token[2].charCodeAt()-'a'.charCodeAt())+(token[3].charCodeAt()-'1'.charCodeAt())*16;
            var promotion;
            if (token.length > 4)
                promotion = token[4];
            return(this.make_move(startSq,endSq));
        }
        
        this.makePGNFromLan = function(lanString) {
            // Convert a Long Alegbraic String to PGN style
            var startFenString = this.getFen();
            // alert("make PGN: "+startFenString);
            var outputString = "";
            if (to_move == 'b')
                outputString += ""+flags['moveCount']+". ... ";
            var moveToken = lanString.split(" ");
            for (i = 0, l = moveToken.length; i<l;i++) {
                var move = this.moveFromLan(moveToken[i]);
                var piece = board[move.from];
                if (to_move == 'w')
                    outputString += ""+flags['moveCount']+". ";
                if (piece.type == 'p') {
                    if (move.capture != null)
                        outputString += moveToken[i][0]+"x";
                    outputString += moveToken[i][2]+moveToken[i][3]+" ";
                } else {
                    outputString += piece.type.toUpperCase();
                    if (move.capture != null)
                        outputString += "x";
                    outputString += moveToken[i][2]+moveToken[i][3]+" ";
                }
                this.playMove(move);
            }
            this.setFen(startFenString);          
            return outputString;
        }
        
        this.playMove = function(move) {
            var piece = board[move.from];
            var mover = piece.colour;
            board[move.from] = null;
            board[move.to] = piece;
            if (move.promotePiece !== undefined && move.promotePiece !== null) {
                board[move.to].type = move.promotePiece;
            }
            if (piece.type == 'k') {
                
                // Check for castling move
                if ((move.from - move.to) == 2) {
                    // Queenside castling
                    board[move.from-1] = board[move.from-4];
                    board[move.from-4] = null;


                } else if ((move.to - move.from) == 2) {
                    // Kingside castling
                    board[move.from+1] = board[move.from+3];
                    board[move.from+3] = null;

                }
                
                flags[mover][0] = false;
                flags[mover][1] = false;
            }
            if (move.from == 0 || move.to == 0) 
                flags['w'][1] = false; 
            if (move.from == 7 || move.to == 7)
                flags['w'][0] = false;
            if (move.from == 112 || move.to == 112) 
                flags['b'][1] = false; 
            if (move.from == 119 || move.to == 119)
                flags['b'][0] = false;
            
            if (piece.type == 'p') {
                if (this.numToSq(move.to) == flags['enpas']) {
                    if (to_move == 'w')
                        board[move.to-16] = null;
                    else
                        board[move.to+16] = null;
                }
                
                if (Math.abs(move.from-move.to) == 32) {
                    if (to_move == 'w')
                        flags['enpas'] = this.numToSq(move.to-16);
                    else
                        flags['enpas'] = this.numToSq(move.to+16);
                } else
                    flags.enpas = "-";
            } else
                flags.enpas = "-";
            to_move = this.swap_colour(to_move);
            if (to_move == 'w')
                flags['moveCount'] += 1;
            
        }
        this.unplayMove = function(move) {
            var piece = board[move.to];
            board[move.to] = null;
            board[move.from] = piece;
            if (move.capture !== null) 
                board[move.from] = move.capture;
            if (move.promotePiece !== null)
                board[move.from].type = 'p';
        }
        
        this.make_move = function(startSq,endSq,promotionPiece) {
            var move = {
                from: startSq,
                to: endSq,
                capture: board[endSq],
                promotePiece: promotionPiece,
            }
            return move;
        }
        
        this.swap_colour = function(colour) {
            if (colour === "w") return "b";
                return "w";
        }
        
        this.generateMoves = function() {
            var moves = [];
            var opp_colour = this.swap_colour(to_move);
            for (var sq = 0; sq < 128; sq++ ) {
                if (sq & 0x88) {
                    sq += 7;
                    continue;
                }
                
                var piece = board[sq];
                if (piece == null || piece.colour !== to_move) {
                    continue;
                }
                
                if (piece.type == 'k') {
                    // Castling possible
                    if (flags[to_move][0]) {
                        // kingside castling check
                        if (board[sq+1] == null && board[sq+2] == null ) {
                            if (!this.isAttacked(sq,opp_colour) && !this.isAttacked(sq+1,opp_colour) && !this.isAttacked(sq+2,opp_colour)) {
                                // assume that rook exists otherwise castle flag should be false
                                moves.push(sq,sq+2);
                            }
                        }
                    }
                    if (flags[to_move][1]) {
                        // queenside castling check
                        if (board[sq-1] == null && board[sq-2] == null &&  board[sq-3] == null) {
                            if (!this.isAttacked(sq,opp_colour) && !this.isAttacked(sq-1,opp_colour) && !this.isAttacked(sq-2,opp_colour)) {
                                // assume that rook exists otherwise castle flag should be false
                                moves.push(sq,sq-2);
                            }
                        }
                    }
                }
                
                if (piece.type == 'p') {
                    var new_sq = sq + pawnDelta[to_move][0];
                    if (board[new_sq] == null) {
                        if (Math.floor(new_sq/16) == last_rank[to_move]) {
                            for (var i = 0; i<4; i++) {
                                moves.push(this.make_move(sq,new_sq,promotionPieces[i]));
                            }
                            
                        } else 
                            moves.push(this.make_move(sq,new_sq));
                        if (Math.floor(sq/16) == second_rank[to_move]) {
                            new_sq += pawnDelta[to_move][0];
                            if (board[new_sq] == null) 
                                moves.push(this.make_move(sq,new_sq));
                        }
                        
                    }
                    for (var j=1; j<3;j++) {
                        var new_sq = sq+pawnDelta[to_move][j];
                        if (new_sq & 0x88) continue;
                        if (board[new_sq] != null && board[new_sq].colour === opp_colour) {
                            moves.push(this.make_move_string(sq,new_sq));
                        }
                    }
                }
                
                else {
                    for (var j = 0, l = moveDelta[piece.type].length; j<l; j++) {
                        var offset = moveDelta[piece.type][j];
                        var square = sq;

                        while (true) {
                            square += offset;
                            if (square & 0x88) break;

                            if (board[square] == null) {
                                moves.push(this.make_move(sq, square));
                            } else {
                                if (board[square].colour === opp_colour) {
                                    moves.push(this.make_move(sq, square));
                                }
                                break;
                            }

                            if (piece.type === 'n' || piece.type === 'k') break;
                        }
                    }   
                }
            }
            return moves;
        }
        this.isAttacked = function(aSq,colour) {
            // Checks if a square is attacked
            // Using the Super-Queen method
            // innefificient but I don't have piece tables
            
            for (var i=0, l = moveDelta['k'].length; i < l; i++) {
                var offset = moveDelta['k'][i];
                var square = aSq + offset;
                if (square & 0x88) continue;
                var piece = board[square];
                if (piece == null) continue;
                if (piece.colour == colour && piece.type == 'k') 
                    return true;
            }
            
            for (var i=0, l = moveDelta['n'].length; i < l; i++) {
                var offset = moveDelta['n'][i];
                var square = aSq + offset;
                if (square & 0x88) continue;
                var piece = board[square];
                if (piece == null) continue;
                if (piece.colour == colour && piece.type == 'n') 
                    return true;
            }
            
            for (var i=0, l = moveDelta['b'].length; i < l; i++) {
                var offset = moveDelta['b'][i];
                var square = aSq;
                while (true) {
                    square += offset;
                    if (square & 0x88) break;
                    if (board[square] == null) continue;
                    if (board[square].colour == colour && (board[sqaure].type == 'q' || board[square].type == 'b'))
                        return true;
                }
            }
            for (var i=0, l = moveDelta['r'].length; i < l; i++) {
                var offset = moveDelta['r'][i];
                var square = aSq;
                while (true) {
                    square += offset;
                    if (square & 0x88) break;
                    if (board[square] == null) continue;
                    if (board[square].colour == colour && (board[sqaure].type == 'q' || board[square].type == 'r'))
                        return true;
                }
            }
            
            for (var i=1;i<3;i++) {
                var square = aSq - pawnDelta[colour];
                if (square & 0x88) continue;
                if (board[square] == null) continue;
                if (board[square].colour == colour && board[square].type == 'p')
                    return true;
            }
                    
            return false;
            
        }
        return this;
        
    }
    return PGNE;
}(jQuery);
/* $(document).ready(function() {
    var pgnengine = HtmlDGT.PGNE();
    pgnengine.makeFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    alert(""+pgnengine.getFen());
    var moveList = pgnengine.generateMoves();
    alert(""+moveList.length);
    pgnengine.playDGTMove(48,32);
    // var pgnString = pgnengine.makePGNFromLan("e2e4 e7e5 g1f3 b8c6 d2d4 e5d4 f1c4 g8f6 e1g1");
    alert(pgnengine.getFen());
}); */