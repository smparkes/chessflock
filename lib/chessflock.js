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

  var css = {"vendor": [ {"jquery.svg": "jquery.svg"},
                         {"jgrowl": "jquery.jgrowl"}
                       ],
              "lib": { "chessflock": [ "chessflock", "play", "serve" ]}};
  each(css, function(fn) {
    global.document.write("<link href='/"+fn+".css' rel='stylesheet' type='text/css'>");
  });

  var javascript = {
    "/vendor": {
      "jquery/dist": [ "jquery" ],
      "jquery-ui": "ui/jquery.effects.core",
      "jquery.svg": [
        "jquery.svg",
        "jquery.svgdom",
        "jquery.svganim"
      ],
      "jquery-resize": "jquery.ba-resize",
      "jquery.print/src": [ "jquery.print" ],
      "jgrowl": "jquery.jgrowl",
      "strophejs/src": [ "base64", "md5", "core" ],
      "feste/lib/feste": [ "feste", "class" ],
      "puck/lib/puck": [ "puck", "subscriber", "publisher" ],
      "dramatis/lib/dramatis": [
        "dramatis",
        "class",
        "actor",
        {"actor": "type"},
        {"actor":
         [ "behavior",
           "name",
           { "name": "type" },
           "interface"
         ] },
        "director",
        "runtime",
        { "runtime": [
          "actor",
          {"actor": [
            "name",
            {"name": [ "base", "local", "remote" ] } ] },
          "callable",
          {"callable": "method"},
          "reactor",
          { "reactor": [
            "channel",
            { "channel": [
              "xmpp"
            ] }
          ] }
        ] },
        "future",
        "continuation",
        "subscriber",
        "publisher"
      ] 
    }, "/lib": {
      "chessflock": [
        "chessflock",
        "class",
        "growl",
        "status",
        "connection",
        "game",
        "board",
        {"board": [
          "view",
          {"view": [ "svg", "table"]}
        ]},
        "ui",
        {"ui": [ "dialog", "base", "multi", "single" ]}
      ]}};
  each(javascript,function(fn,prefix) {
    include(fn+".js",prefix);
  });

}());

