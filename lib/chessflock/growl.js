"use strict";
(function($){
  var global = (function(){return this;}());

  ChessFlock.Growl = new ChessFlock.Class();
  new ChessFlock.Class.Subscope(ChessFlock.Growl);

  var icon;
  var glow;

  var loaded = 0;
  var queue = [];
  var onload = function() {
    if (++loaded === 2) {
      var queued;
      while ((queued=queue.shift())) {
        queued();
      }
    }
  };

  $.jGrowl.defaults.closer = false;
  $.jGrowl.defaults.closeTemplate = "";

  $(function(){
    var root = global.jazz && global.jazz.app_root && global.jazz.app_root+"/public" || "";
    $("<div></div>").
      svg({
        loadURL: root+"/icon.svg",
        onLoad: function(wrapper){
          icon = $(wrapper.root());
          onload();
        }
      });

    $("<div></div>").
      svg({
        loadURL: root+"/growlglow.svg",
        onLoad: function(wrapper){
          glow = $(wrapper.root());
          onload();
        }
      });

    $(".jGrowl-notification").live('click',function(){
      $(this).trigger("jGrowl.close");
      return false;
    });
  });

  var auto;
  var dismiss = function(element) {
    if (loaded < 2) {
      queue.push(function(){dismiss(element);});
      return;
    }

    var clone;
    clone = glow.clone().prependTo(element).
      addClass("glow");

    clone = icon.clone().prependTo(element).
      addClass("icon");

    $(element).append("<div class='growl clear'></div>");
    var nil;
    if (auto) {
      $(auto).trigger("jGrowl.close");
    }
    auto = nil;
  };

  ChessFlock.Growl.Notification =
    new ChessFlock.Growl.Class(function Notification(string, type) {
      var nil;
      if (type===nil) {
        type = "auto";
      }
      if (type==="auto") {
        type = "transient";
      }
      var options = {
        open: dismiss,
        speed: 1000,
        life: 1500
      };
      switch(type) {
       case "transient":
        break;
       case "auto":
        options.sticky = true;
        options.open = function(element) {
          dismiss.apply(this,arguments);
          auto = element;
        };
        break;
       case "sticky":
        options.sticky = true;
        break;
      }
      $.jGrowl(string,options);
    });

}(jQuery));