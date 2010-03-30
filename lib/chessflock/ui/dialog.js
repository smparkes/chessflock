"use strict";
(function($){

  var global = (function(){return this;}());

  ChessFlock.UI.Dialog = new ChessFlock.UI.Class(function Dialog(contents){
    if (this.constructor !== Dialog) {
      global.console.debug(contents.innerHTML);
      this.div = $("<div class='chessflock dialog'></div>").
        append((this.contents = contents)).
        appendTo(global.document.body).
        css("opacity",0);
      var proxy = $.proxy(this.render,this);
      $(global).resize(proxy);
      $(contents).resize(proxy);
      this.render();
      this.show();
    }
  }, {
    render: function() {
      var width = $(global).width();
      var height = $(global).height();
      var size = Math.min(width,height)*0.5;
      global.div = this.div; 
      global.contents = this.contents;
      this.div.
        css("position","absolute").
        css("top",size/2).
        css("left",(width-size)/2).
        css("width",size).
        css("height",size);
      $(this.contents).css("width",size*0.8);
      width = $(this.contents).width();
      height = $(this.contents).height();
      global.console.debug(size,width,height,(size-width)/2,(size-height)/2);
      var was_rendered = this.rendered;
      this.rendered = (size - width) > 1;
      $(this.contents).
        css("position","absolute").
        css("top",(size-height)/2+"px").
        css("left",(size-width)/2+"px").
        css("font-size",Math.floor(width/10)+"px");
      if (this.rendered && !this.was_rendered && this.showing) {
        this.show();
      }
    },
    show: function() {
      this.showing = true;
      if (this.rendered) {
        this.div.animate({
          "opacity": 0.9
        }, {
          duration: 250
        });
      }
    },
    hide: function(fn) {
      fn = fn || function(){};
      this.div.animate({
        "opacity": 0
      }, {
        duration: 250,
        complete: fn
      });
      this.showing = false;
    },
    destroy: function() {
      var self = this;
      this.hide(function(){
        $(this.div).remove();
      });
    }
  });
 
}(jQuery));