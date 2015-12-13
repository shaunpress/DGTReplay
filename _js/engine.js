var HtmlDGT = window.HtmlDGT || {};
HtmlDGT.engine = function($) {
   
    var engine = function() {
        var g_backgroundEngineValid = true;
        var g_backgroundEngine;
        var g_analyzing = false;
        this.run_engine = function(fenString) {
            // Runs the Garbochess Engine
            this.UpdatePVDisplay("Click for analysis");
            this.EnsureAnalysisStopped();
            // g_analyzing = false;
            ResetGame();
            if (this.InitializeBackgroundEngine(this)) {
                if (fenString !== undefined) {
                    InitializeFromFen(fenString);
                    g_backgroundEngine.postMessage("position "+fenString);
                    // alert(fenString);
                }
                if (g_analyzing)
                    g_backgroundEngine.postMessage("analyze");
                //g_analyzing = true;
            }


        };
        
        this.toggleEngine = function() {
            if (this.InitializeBackgroundEngine(this)) {
                if (!g_analyzing) {
                    g_backgroundEngine.postMessage("analyze");
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
                    g_backgroundEngine = new Worker("_js/garbochess.js");
                    g_backgroundEngine.onmessage = function (e) {
                        if (e.data.match("^pv") == "pv") {
                            that.UpdatePVDisplay(e.data.substr(3, e.data.length - 3));
                        } else if (e.data.match("^message") == "message") {
                            that.EnsureAnalysisStopped();
                            that.UpdatePVDisplay(e.data.substr(8, e.data.length - 8));
                        }
                    }
                    g_backgroundEngine.error = function (e) {
                        alert("Error from background worker:" + e.message);
                    }
                    g_backgroundEngine.postMessage("position " + GetFen());
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