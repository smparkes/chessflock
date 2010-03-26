/*jslint evil:true*/
"use strict";
(function(){return this;}()).ChessFlock = (function($){
  var ChessFlock = {};

  var global = (function(){return this;}());
  var document = global.document;
  var navigator = global.navigator;

  var old = this.ChessFlock;
  ChessFlock.no_conflict = function() {
    (function(){return this;}()).ChessFlock = old;
  };

  ChessFlock.svgimage = function(src,options) {
    var string = [];
    if (navigator.userAgent.indexOf("WebKit") >= 0) {
      string.push("<img class='svg' src='"+src+"' type='image/svg+xml'");
    } else {
      string.push("<object class='svg' data='"+src+"' type='image/svg+xml'");
    }
    for(var key in options) {
      string.push(" ");
      string.push(key);
      string.push("='");
      string.push(options[key]);
      string.push("'");
    }
    if (navigator.userAgent.indexOf("WebKit") >= 0) {
      string.push(">");
    } else {
      string.push("></object>");
    }
    document.write(string.join(""));
  };
  
  var external_logger = global.console && global.console.log && function() {
    for(var i in arguments) {
      global.console.log(arguments[i]);
    }
  } || function(){};

  ChessFlock.log = function(text, options) {
    options = options || {};
    var string = "ChessFlock: " + text;
    $("title").html(string);
    options.life = 5000;
    options.speed = "slow";
    options.beforeClose = function() {
        $("title").html("ChessFlock");
    };
    $.jGrowl(text,options);
    external_logger(string);
  };

  ChessFlock.debug = function(text) {
    var string = "ChessFlock: " + text;
    $("<div></div>").appendTo(document.body).html(string);
    $("title").html(string);
    external_logger(string);
  };

  ChessFlock.connect = function connect() {
    var self = this;
    var nil;
    ChessFlock.log("Connecting ...", {
      sticky: true,
      open: function(element) {
        self.connecting = element;
      }
    });
    try {
      Dramatis.connect(ChessFlock.bosh_uri, function connected(connection){
        connection.on_disconnect(function(reason){
          ChessFlock.log("Disconnected" + (reason ? " ("+reason+")" : "" ));
        });
        ChessFlock.log("Connected as "+connection.uri(),{
          open: function() {
            if (self.connecting) {
              $(self.connecting).trigger("jGrowl.close");
            }
            self.connecing = nil;
          }
        });
        ChessFlock.$("svg > g").fadeTo("slow",1.0);
        if (ChessFlock.ready) { ChessFlock.ready(); }
      }, function connection_failed(reason){
        ChessFlock.log("Cound not connect: "+reason);
      }, function connect_timed_out(){
        ChessFlock.log("Connection timed out without completing");
      });
    } catch(e) {
      ChessFlock.log("Connection handshake failed: "+e);
      ChessFlock.log("Connection handshake failed: "+e.stack);
    }
  };

  ChessFlock.capture = function() {
    ChessFlock.log("Connecting ...");
    new ChessFlock.Browser();
  };

  $(function() {
    $.jGrowl.defaults.closer = false;
    if (global.console.debug) {
      Strophe.log = function (level, msg) {
        // global.console.debug(level+" "+msg);
      };
    }

    ChessFlock.connect();
  });

  ChessFlock.$ = $;

  return ChessFlock;
}(jQuery));
