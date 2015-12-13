var HtmlDGT = window.HtmlDGT || {};
HtmlDGT.Main = (function($) {
    var Main = function() {};
    return Main;
})(jQuery);
$(document).ready(function() {
    var tournament_no = HtmlDGT.File.parseURLArgs('tournament');
    var round_no = HtmlDGT.File.parseURLArgs('round');
    var board_no = HtmlDGT.File.parseURLArgs('board');
    var board = HtmlDGT.Board();
    var engine = HtmlDGT.engine();
    // board.updateFromFile(round_no);
    HtmlDGT.ui.init(board);
    HtmlDGT.ui.setBoard(board,engine);
    HtmlDGT.ui.drawBoard(board);
    run_update(board,tournament_no,round_no,board_no);
    engine.run_engine();
    window.setInterval(function () {
        run_update(board,tournament_no,round_no,board_no);
    },20000);
    
});
var run_update = function(board,tournament_no,round_no,board_no) {
     HtmlDGT.File.queryData(board,tournament_no,round_no,board_no);
    // board.updateFromQuery(testData,0);
    HtmlDGT.ui.updatePlayerList(board);
    board.updateInfo(-1);
}


