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
        });
        self.log("Connected as "+connection.uri(),"transient");
        $("svg > g").fadeTo("slow",1.0);
      }, function connection_failed(reason){
        self.log("Cound not connect: "+reason);
      }, function connect_timed_out(){
        self.log("Connection timed out without completing");
      });
    } catch(e) {
      self.log("Connection handshake failed: "+e);
      ChessFlock.log("Connection handshake failed: "+e.stack);
    }

    self.dimiss = function() {
      if (self.auto) {
        $(self.auto).trigger("jGrowl.close");
      }
      self.auto = nil;
    };

  },{
    disconnected: function(reason) {
      this.log("Disconnected" + (reason ? " ("+reason+")" : "" ), "auto");
    },
    log: function(string,type) {
      ChessFlock.log(string);
      var nil;
      if (type===nil) {
        type = "auto";
      }
      var self = this;
      var options ={ open: this.dismiss };
      switch(type) {
       case "transient":
        break;
       case "auto":
        options.sticky = true;
        options.open = function(element) {
          self.dimiss();
          self.auto = element;
        };
        break;
       case "sticky":
        options.sticky = true;
        break;
      }
      $.jGrowl(string,options);
    }
  });
  new ChessFlock.Class.Subscope(ChessFlock.Connection);
}(jQuery));