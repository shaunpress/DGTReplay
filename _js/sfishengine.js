var HtmlDGT = window.HtmlDGT || {};
HtmlDGT.engine = function($) {
   
    var engine = function() {
        var g_backgroundEngineValid = true;
        var g_backgroundEngine;
        var g_analyzing = false;
        var g_currentFen;
        var pgnEngine;
        this.setPgne = function(newPgne) {
            pgnEngine = newPgne;
        }
        
        this.run_engine = function(fenString) {
            // Runs the Garbochess Engine
            this.UpdatePVDisplay("Click for analysis");
            this.EnsureAnalysisStopped();
            // g_analyzing = false;
            // ResetGame();
            if (this.InitializeBackgroundEngine(this)) {
                g_backgroundEngine.postMessage("setoption name Hash value 1");
                if (fenString !== undefined) {
                    // InitializeFromFen(fenString);
                    g_currentFen = fenString;
                    g_backgroundEngine.postMessage("position fen "+fenString);
                    // alert(fenString);
                }
                if (g_analyzing)
                    g_backgroundEngine.postMessage("go infinite");
                //g_analyzing = true;
            }


        };
        
        this.toggleEngine = function() {
            if (this.InitializeBackgroundEngine(this)) {
                g_backgroundEngine.postMessage("setoption name Hash value 1");
                if (!g_analyzing) {
                    g_backgroundEngine.postMessage("position fen "+g_currentFen);
                    g_backgroundEngine.postMessage("go infinite");
                } else {
                    this.EnsureAnalysisStopped();
                    this.UpdatePVDisplay("Click for analysis");
                }
                g_analyzing = !g_analyzing;
            }
        };
        
        

        this.UpdatePVDisplay = function(pv) {
            if (pv != null) {
                var outputDiv = document.getElementById("output_box");
                if (outputDiv.firstChild != null) {
                    outputDiv.removeChild(outputDiv.firstChild);
                }
                outputDiv.appendChild(document.createTextNode(pv));
            }
        };

        this. EnsureAnalysisStopped = function() {
            if (g_analyzing && g_backgroundEngine != null) {
                g_backgroundEngine.terminate();
                g_backgroundEngine = null;
            }
        };

        
        this.InitializeBackgroundEngine = function(that) {
            
            if (!g_backgroundEngineValid) {
                alert("Invalid Engine");
                return false;
            }

            if (g_backgroundEngine == null) {
                g_backgroundEngineValid = true;
                try {
                    g_backgroundEngine = new Worker("_js/stockfish.js");
                    g_backgroundEngine.onmessage = function (e) {
                        var line = e.data;
                        var outputString = "";
                        var match;
                        var pvStart;
                        if (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/)) {
                            outputString += "Depth :"+match[1];
                            // that.UpdatePVDisplay(match[1]);
                        } else if (e.data.match("^message") == "message") {
                            that.EnsureAnalysisStopped();
                            that.UpdatePVDisplay(e.data.substr(8, e.data.length - 8));
                        } else {
                           // that.UpdatePVDisplay(e.data);
                        }
                        if (match = line.match(/^info .*\bscore (\w+) (-?\d+)/)) {
                            var score = parseInt(match[2]);
                            if (match[1] == "cp") {
                                score = (score / 100.0).toFixed(2);
                                if (pgnEngine.getMover() == 'b')
                                    score = -score;
                                outputString += " Score: "+score;
                            } else if(match[1] == 'mate') {
                                outputString += " Mate in "+ Math.abs(score);
                            }
                                   
                        }
                        pvStart = line.indexOf(" pv ");
                        if (pvStart > 0) {
                            // alert(pgnEngine.getFen());
                            var pvString = line.substring(pvStart+4);
                            outputString += " "+pgnEngine.makePGNFromLan(pvString);
                            that.UpdatePVDisplay(outputString);
                        }
                        
                        
                    }
                    g_backgroundEngine.error = function (e) {
                        alert("Error from background worker:" + e.message);
                    }
                    // g_backgroundEngine.postMessage("position fen " + GetFen());
                } catch (error) {
                    g_backgroundEngineValid = false;
                }
            }

            return g_backgroundEngineValid;
        };
        return this;
    }
    return engine;

}(jQuery);