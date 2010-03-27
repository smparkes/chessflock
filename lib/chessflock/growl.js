"use strict";
(function($){
  var global = (function(){return this;}());

  ChessFlock.Growl = new ChessFlock.Class();
  new ChessFlock.Class.Subscope(ChessFlock.Growl);

  var auto;
  var dismiss = function(element) {
    global.console.debug(element.html());
    var nil;
    if (auto) {
      $(auto).trigger("jGrowl.close");
    }
    auto = nil;
  };

  var svg_template;
  var svg;

  $(function(){

    svg_template = $("<div class='growl'></dvi>").appendTo(global.document.body);
    svg_template.svg({
      loadURL: "/growl.svg",
      onLoad: function(wrapper){
        svg = wrapper.root();
        svg.removeAttribute("height");
        svg.removeAttribute("width");
      }
    });

    $.jGrowl.defaults.closer = false;
    $.jGrowl.defaults.closeTemplate = "";
    $(".jGrowl-notification").live('click',function(){
      $(this).trigger("jGrowl.close");
      return false;
    });
  });

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