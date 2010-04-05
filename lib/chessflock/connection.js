"use strict";
(function($){
  var global = (function(){return this;}());
  ChessFlock.Connection = new ChessFlock.Class(function Connection(uri){
    var string = "Connecting ...";
    if (global.localStorage && global.localStorage.bosh_uri) {
      string = "Reconnecting ...";
      uri = global.localStorage.bosh_uri;
    }
    this.log(string);
    var self = this;
    try {
      Dramatis.connect(uri, function connected(connection){
        connection.on_disconnect(function(reason){
          self.disconnected(reason);
          ChessFlock.status().warning("disconnected");
        });
        if (global.localStorage) {
          global.localStorage.bosh_uri = uri;
        }
        var string = connection.uri().replace(/^xmpp:/,"");
        var breakable =
          string.replace(/@/g, "&#8203;@&#8203;").
          replace(/\//g, "&#8203;/&#8203;");
        self.log("Connected as "+breakable,"transient");
        ChessFlock.status().good($("<span>"+string+"</span>").
                                 append( $("<span class='suffix'><button>logout</button></div>").click(
                                   $.proxy(self.logout,self)
                                 )));
      }, function connection_failed(reason){
        reason = (reason !== 0) ? reason : "no additional information";
        self.log("Could not connect: "+reason);
        ChessFlock.status().bad("Could not connect");
      }, function connect_timed_out(){
        self.log("Connection timed out without completing");
        ChessFlock.status().bad("Connect timed out");
      });
    } catch(e) {
      self.log("Connection handshake failed: "+e);
      ChessFlock.log("Connection handshake failed: "+e.stack);
      ChessFlock.status().bad("Connection failed");
    }
  },{
    logout: function() {
      if (global.localStorage) {
        global.localStorage.clear();
      }
      global.location.reload();
    },
    disconnected: function(reason) {
      this.log("Disconnected" + (reason ? " ("+reason+")" : "" ), "auto");
      ChessFlock.status().clear();
    },
    log: function(string,type) {
      ChessFlock.growl(string,type);
    }
  });
  new ChessFlock.Class.Subscope(ChessFlock.Connection);
}(jQuery));