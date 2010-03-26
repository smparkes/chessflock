/*jslint evil:true*/
"use strict";
(function(){return this;}()).Checkmate = (function($){
  var Checkmate = {};

  var global = (function(){return this;}());
  var document = global.document;
  var navigator = global.navigator;

  var old = this.Checkmate;
  Checkmate.no_conflict = function() {
    (function(){return this;}()).Checkmate = old;
  };

  Checkmate.svgimage = function(src,options) {
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

  Checkmate.log = function(text, options) {
    options = options || {};
    var string = "Checkmate: " + text;
    $("title").html(string);
    options.life = 5000;
    options.speed = "slow";
    options.beforeClose = function() {
        $("title").html("Checkmate");
    };
    $.jGrowl(text,options);
    external_logger(string);
  };

  Checkmate.debug = function(text) {
    var string = "Checkmate: " + text;
    $("<div></div>").appendTo(document.body).html(string);
    $("title").html(string);
    external_logger(string);
  };

  Checkmate.connect = function connect() {
    var self = this;
    var nil;
    Checkmate.log("Connecting ...", {
      sticky: true,
      open: function(element) {
        self.connecting = element;
      }
    });
    try {
      Dramatis.connect(Checkmate.bosh_uri, function connected(connection){
        connection.on_disconnect(function(reason){
          Checkmate.log("Disconnected" + (reason ? " ("+reason+")" : "" ));
        });
        Checkmate.log("Connected as "+connection.uri(),{
          open: function() {
            if (self.connecting) {
              $(self.connecting).trigger("jGrowl.close");
            }
            self.connecing = nil;
          }
        });
        Checkmate.$("svg > g").fadeTo("slow",1.0);
        if (Checkmate.ready) { Checkmate.ready(); }
      }, function connection_failed(reason){
        Checkmate.log("Cound not connect: "+reason);
      }, function connect_timed_out(){
        Checkmate.log("Connection timed out without completing");
      });
    } catch(e) {
      Checkmate.log("Connection handshake failed: "+e);
      Checkmate.log("Connection handshake failed: "+e.stack);
    }
  };

  Checkmate.capture = function() {
    Checkmate.log("Connecting ...");
    new Checkmate.Browser();
  };

  $(function() {
    $.jGrowl.defaults.closer = false;
    if (global.console.debug) {
      Strophe.log = function (level, msg) {
        // global.console.debug(level+" "+msg);
      };
    }

    Checkmate.connect();
  });

  Checkmate.$ = $;

  return Checkmate;
}(jQuery));
