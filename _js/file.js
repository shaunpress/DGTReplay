var HtmlDGT = window.HtmlDGT || {};
HtmlDGT.File = (function($){
    var File = {
        init: function(){
        
        },
        loadData: function(filePath) {
            var ret_data;
            $.ajax({
                async: false,
                url: filePath,
                success: function(data) {
                    ret_data = data;
                },
                error: function() {
                    ret_data = null;
                }
            });
            return ret_data;
        },
        queryData: function(board,tournament_no,round_no,game_no) {
            var ret_data;
            var getParam = "?tournament="+tournament_no+"&round="+round_no+"&board="+game_no;
            var urlString = 'http://localhost/htmldgt/_php/fetchGameData.php'+getParam;
            $.ajax({
                async: true,
                url: urlString,
                success: function(data) {
                    ret_data = data;
                    board.updateFromQuery(ret_data,-1);
                    HtmlDGT.ui.updatePlayerList(board);
                    board.updateInfo(-1);
                    
                },
                error: function() {
                    ret_data = null;
                }
            });
            
            return ret_data;
        },
        getPlayers: function() {
            var playerList = [];
            var loading = true;
            var playerNum = 1;
            while (loading) {
                var filePath = "game"+playerNum+".txt";
                var playerData = this.loadData(filePath);
                if (playerData === null) {
                    loading = false;
                } else {
                    playerList.push(playerData);
                    playerNum++;
                }
            }
            return playerList;
        },
        getGames: function() {
            var gameList = [];
            var loading = true;
            var gameNum = 1;
            while (loading) {
                var filePath = "pos"+gameNum+".txt";
                var gameData = this.loadData(filePath);
                if (gameData === null) {
                    loading = false;
                } else {
                    gameList.push(gameData);
                    gameNum++;
                }
            }
            return gameList;
        },
        parseMoves : function(moveData) {
            var dataArray = moveData.match(/[^<>]+/g);
            return dataArray;
        },
        parseURLArgs : function(name) {
            var results = new RegExp('[\?&amp;]' + name + 
                                     '=([^&amp;#]*)').exec(window.location.href);
            if (results === null) {
                results = [0,0];
            }
            return results[1] || 0;
        }
        
    } 
    return File;
})(jQuery);
