/*jslint evil:true*/
"use strict";
(function(){

  var global = (function(){return this;}());

  var include = function(fn,prefix) {
    if (global.jazz) {
      global.jazz.include((global.jazz.app_root ? global.jazz.app_root+"/" : "")+fn);
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
    if (!global.Envjs) {
      global.document.write("<link href='/"+fn+".css' rel='stylesheet' type='text/css'>");
    }
  });

  var javascript = {
    "vendor": {
      "jquery/dist": [ "jquery" ],
      "jquery-ui": [
        "ui/jquery.effects.core",
        "ui/jquery.ui.core",
        "ui/jquery.ui.widget",
        "ui/jquery.ui.mouse",
        "ui/jquery.ui.draggable"
      ],
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
      "puck/lib/puck": [
        "puck",
        "subscriber",
        "publisher",
        "state"
      ],
      "dramatis/lib": 
      { "dramatis": [
        "dramatis",
        "class",
        "exceptions",
        "publisher",
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
          "task",
          "actor",
          {"actor": [
            "name",
            {"name": ["base", "local", "remote"]}]},
          "callable",
          {"callable": [ "method", "function", "discard"]},
          "reactor",
          { "reactor": [
            "channel",
            { "channel": [
              "xmpp"
            ] }
          ] }
        ] },
        "future",
        "continue",
        "continuation",
        "subscriber"
      ] }
    }, "lib": {
      "chessflock": [
        "chessflock",
        "class",
        "growl",
        "status",
        "connection",
        "piece",
        "pieces",
        "game",
        "board",
        {"board": [
          "view",
          {"view": [ "svg", "table"]}
        ]},
        "ui",
        {"ui": [ "dialog", "multi", "single" ]}
      ]}};
  each(javascript,function(fn,prefix) {
    include(fn+".js",prefix);
  });

}());

