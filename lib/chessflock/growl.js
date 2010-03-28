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
    $("<div class='icon'></div>").
      appendTo((icon = $("<div class='growl'></div>").hide().appendTo(global.document.body))).
      svg({
        loadURL: "/icon.svg",
        onLoad: function(wrapper){
          var svg = wrapper.root();
          svg.removeAttribute("height");
          svg.removeAttribute("width");
          onload();
        }
      });

    $("<div class='glow'></div>").
      appendTo((glow = $("<div class='growl'></div>").hide().appendTo(global.document.body))).
      svg({
        loadURL: "/growlglow.svg",
        onLoad: function(wrapper){
          var svg = wrapper.root();
          svg.removeAttribute("height");
          svg.removeAttribute("width");
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
    if (!icon || !glow) {
      queue.push(function(){dismiss(element);});
      return;
    }
    global.console.debug(element.html());
    global.console.debug("cw",global.document.body.clientWidth);
    $(element).prepend($(glow).clone().show());
    $(element).prepend($(icon).clone().show());
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
      var options ={
        open: this.dismiss
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