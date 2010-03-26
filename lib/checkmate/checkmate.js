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

  Checkmate.log = function(text) {
    var string = "Checkmate: " + text;
    $("<div></div>").appendTo(document.body).html(string);
    $("title").html(string);
    external_logger(string);
  };

  Checkmate.debug = function(text) {
    var string = "Checkmate: " + text;
    $("<div></div>").appendTo(document.body).html(string);
    $("title").html(string);
    external_logger(string);
  };

  Checkmate.connect = function connect() {
    Checkmate.log("Connecting ...");
    try {
      Dramatis.connect(Checkmate.bosh_uri, function connected(connection){
        connection.on_disconnect(function(reason){
          Checkmate.log("Disconnected" + (reason ? " ("+reason+")" : "" ));
        });
        Checkmate.log("Connected as "+connection.uri());
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
    if (global.console.debug) {
      Strophe.log = function (level, msg) {
        // global.console.debug(level+" "+msg);
      };
    }

    Checkmate.debug(navigator.userAgent);
    Checkmate.connect();
  });

  Checkmate.$ = $;

  return Checkmate;
}(jQuery));
