/*jslint evil:true*/
"use strict";
(function(){return this;}()).ChessFlock = (function($){
  var ChessFlock = {};

  var global = (function(){return this;}());

  // Don't show downloading forever ...
  global.status = " ";

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


  ChessFlock.growl = function(string, type) {
    ChessFlock.log(string);
    new ChessFlock.Growl.Notification(string, type);
  };

  ChessFlock.log = function(text) {
    external_logger(text);
  };

  ChessFlock.debug = function(text) {
    var string = "ChessFlock: " + text;
    $("<div></div>").appendTo(document.body).html(string);
    external_logger(string);
  };


  $(function() {
    if (global.console.debug) {
      Strophe.log = function (level, msg) {
        // global.console.debug(level+" "+msg);
      };
    }
  });

  ChessFlock.$ = $;

  return ChessFlock;
}(jQuery));
