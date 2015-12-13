var HtmlDGT = window.HtmlDGT || {};
HtmlDGT.Square = (function($){
    var Square = function(row,col,colour,type,square_div) {
        var that = this;
        this.getType = function() { return type;};
        this.getColour = function() { return colour;};
        this.getDiv = function() { return square_div;};
        this.getCol = function() { return col;};
        this.getRow = function() { return row;};
        this.setPiece = function(colour,newtype) {
            type = newtype;
            var srcName = '_img/'+colour+type+'.png';
            var piece_string = '<img src="'+srcName+'" style="width:50px; height:50px" />';
            square_div.append(piece_string);
            if (colour == 'b')
                type = type.toLowerCase();
        };
        this.setPieceWithChar = function(pieceType) {
            if (pieceType === pieceType.toLowerCase()) {
                var colour = 'b';
            } else {
                var colour = 'w';
            }
            type = pieceType;
            this.setPiece(colour,pieceType.toUpperCase());
        };
        this.clearSquare = function() {
            colour = " ";
            type = " ";
            square_div.find("img").remove();
        };
        
        this.getSquarePiece = function() {
            // returns Fen char
            if (this.getColour() === 'b' ) 
                return this.getType().toLowerCase();
            if (this.getColour() === 'w')
                return this.getType();
            return this.getType();
        };
            
                
    };
    Square.create = function(rowNum,colNum,colour,type){
        var square_div = $(document.createElement("div"));
        square_div.addClass("square");
        if ((rowNum % 2) == (colNum % 2)) {
            square_div.addClass("black-square");
        } else {
            square_div.addClass("white-square");
        };
        
        var square = new Square(rowNum,colNum,colour,type,square_div);
        return square;
    };
    return Square;
})(jQuery);