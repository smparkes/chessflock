"use strict";
(function($){
  var global = (function(){return this;}());

  var growl = function() {
    ChessFlock.growl.apply(ChessFlock,arguments);
  };    

  ChessFlock.Status = new ChessFlock.Class(function(){
    this.div = $("<div class='chessflock status'></div>").
      appendTo(global.document.body);
    this.content = $("<div class='content'></div>").appendTo(this.div);
    var self = this;
    $(global).resize($.proxy(this.resize,this));
    $(this.div).css("height",0);
    this.resize();
  }, {
    resize: function() {
      var width = $(global).width();
      var height = $(this.div).height();
      if (height && height !== 0) {
        var text = $(this.content).text();
        if (text && text !== "") {
          height = $(this.content).height();
        }
      }
      $(this.div).
        css("position","absolute").
        css("left",0).
        css("bottom",0).
        css("height",height).
        css("width",width).
        css("overflow","hidden");
    },
    clear: function () {
      $(this.div).hide();
    },
    good: function (string) {
      var self = this;
      self.hide(string,function(){
        $(self.div).
          addClass("good").
          removeClass("warning bad");
        $(self.content).empty();
        $(self.content).append(string);
        self.show();
      });
    },
    warning: function (string) {
      var self = this;
      self.hide(string,function(){
        $(self.div).
          addClass("warning").
          removeClass("good bad");
        $(self.content).text(string);
        self.show();
      });
    },
    bad: function (string) {
      var self = this;
      self.hide(string,function(){
        $(self.div).
          addClass("bad").
          removeClass("good warning");
        $(self.content).text(string);
        self.show();
      });
    },
    hide: function(string, after) {
      var old = $(this.content).text();
      after = after || function(){};
      if (old && old !== "") {
        $(this.div).animate({
          "height": 0
        }, {
          duration: 1000,
          complete: after
        });
      } else {
        after();
      }
    },
    show: function() {
      $(this.div).animate({
        "height": $(this.content).height()
      }, {
        duration: 1000
      });
    }
  });

  
  var status;
  ChessFlock.status = function() {
    return (status = status || new ChessFlock.Status());
  };

}(jQuery));