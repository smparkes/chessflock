/*jslint evil:true*/
"use strict";
(function(){

  var global = (function(){return this;}());

  var include = function(fn,prefix) {
    if (global.jazz) {
      global.jazz.include(fn);
    } else {
      global.document.write("<script src='"+fn+"'></script>");
    }
  };

  var each = function(object, fn) {
    return (function each(prefix, object, fn) {
      if(typeof object === "string" ||
         typeof object === "object" && object instanceof String) {
        fn(prefix.concat(object).join("/"),prefix);
      } else if(object instanceof Array) {
        for(var i=0; i < object.length; i++) {
          each(prefix,object[i],fn);
        }
      } else {
        for(var key in object) {
          each(prefix.concat(key),object[key],fn);
        }
      }
    }([], object, fn));
  };

  var javascript = {
    "/vendor": {
      "jquery/dist": [ "jquery" ],
      "jquery.print/dist": [ "jquery.print" ],
      "jquery.svg": [ "jquery.svg", "jquery.svgdom" ],
      "strophejs/src": [ "base64", "md5", "core" ],
      "feste/lib/feste": [ "feste", "class" ],
      "dramatis/lib/dramatis": [
        "dramatis",
        "class",
        "actor",
        "director",
        "runtime",
        "runtime/reactor",
        "runtime/reactor/channel",
        "runtime/reactor/channel/xmpp" ]
    }, "/lib": {
      "checkmate": [
        "checkmate",
        "class",
        "board",
        {"board": [
          "view",
          {"view": [ "svg", "table"]}
        ]}
      ]}};
  each(javascript,function(fn,prefix) {
    include(fn+".js",prefix);
  });

  var css = [ {"vendor/jquery.svg": "jquery.svg"},
               {"lib": { "checkmate": [ "checkmate", "play", "serve" ]} }
            ];
  each(css, function(fn) {
    global.document.write("<link href='/"+fn+".css' rel='stylesheet' type='text/css'>");
  });

}());

