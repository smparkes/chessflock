"use strict";
(function($){
  ChessFlock.Connection = new ChessFlock.Class(function Connection(){
    var nil;
    this.auto = nil;
    this.log("Connecting ...");
    var self = this;
    try {
      Dramatis.connect(ChessFlock.bosh_uri, function connected(connection){
        connection.on_disconnect(function(reason){
          self.disconnected(reason);
          ChessFlock.status.warning("disconnected");
        });
        var string = connection.uri().replace(/^xmpp:/,"");
        var breakable =
          string.replace(/@/g, "&#8203;@&#8203;").
          replace(/\//g, "&#8203;/&#8203;");
        self.log("Connected as "+breakable,"transient");
        ChessFlock.status.good(string);
      }, function connection_failed(reason){
        reason = (reason !== 0) ? reason : "no additional information";
        self.log("Could not connect: "+reason);
        ChessFlock.status.bad("Could not connect");
      }, function connect_timed_out(){
        self.log("Connection timed out without completing");
        ChessFlock.status.bad("Connect timed out");
      });
    } catch(e) {
      self.log("Connection handshake failed: "+e);
      ChessFlock.log("Connection handshake failed: "+e.stack);
      ChessFlock.status.bad("Connection failed");
    }
  },{
    disconnected: function(reason) {
      this.log("Disconnected" + (reason ? " ("+reason+")" : "" ), "auto");
      ChessFlock.status.clear();
    },
    log: function(string,type) {
      ChessFlock.growl(string,type);
    }
  });
  new ChessFlock.Class.Subscope(ChessFlock.Connection);
}(jQuery));