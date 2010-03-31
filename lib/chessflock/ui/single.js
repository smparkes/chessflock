"use strict";
(function($){

  var global = (function(){return this;}());
  var choices;

  var c = Dramatis.Continuation;

  var load_choices = function(callback) {
    var loaded = 0;
    var black;
    var white;
    var after = function(wrapper) {
      wrapper.root().removeAttribute("width");
      wrapper.root().removeAttribute("height");
      $(wrapper.root()).attr("width",0).attr("height",0);
      if (++loaded === 2) {
        choices = {black: $(black).children("svg"), white: $(white).children("svg")};
        $(choices.black).addClass("black");
        $(choices.white).addClass("white");
        callback();
      }
    };

    // NB: firefox get confused if you hide something and then copy it and display.
    // Do invisible via size.

    black = $("<div class='black'></div>").appendTo(global.document.body).svg({
      loadURL:"/black.svg",
      onLoad: after
    });
    white = $("<div class='white'></div>").appendTo(global.document.body).svg({
      loadURL:"/white.svg",
      onLoad: after
    });
  };

  var Beginning = new ChessFlock.Class(function Beginning(ui) {
    this.ui = ui;
    var self = this;
    var after = function(){
      ChessFlock.UI.Dialog.call(self,self.content());
    };
    if (!choices) {
      load_choices(after);
    } else {
      after();
    }
  }, [ ChessFlock.UI.Dialog ], {
    start: function(event) {
      event.stopPropagation();
      var color = $(event.currentTarget).hasClass("black") ? "black" : "white";
      this.ui.start(color);
      this.destroy();
    },
    content: function() {
      if (!this.div) {
        this.div = $("<div class='beginning'></div>");
        this.div.append(
          "<div>Start a new game as</div>"
        );
        var black = $(choices.black).clone().show().click($.proxy(this.start,this));
        var white = $(choices.white).clone().show().click($.proxy(this.start,this));
        var or = $("<div></div>").
          appendTo(this.div).
          append(black).
          append("<span> or </span>").
          append(white);
        this.div.append(
          "<div>or <button>join</button> a game with</div>"
        );
        this.div.append(
          "<input type='text' value='"+"chess@chessflock"+"'></input>"
        );
        $(this.div).resize($.proxy(this.resize,this));
        this.resize();
      }
      return this.div;
    },
    resize: function() {
      $(this.div).find("svg").
        attr("width",$(this.div).width()/4).
        attr("height",$(this.div).width()/4).
        css("margin",$(this.div).width()/40);
      $(this.div).find("input[type=text]").
        css("font-size",$(this.div).width()/20).
        css("width",$(this.contents).width());
    }
  });

  ChessFlock.UI.Single = new ChessFlock.UI.Class(function Single(){
    ChessFlock.UI.Base.call(this, ChessFlock.bosh_uri);
    this.view = new ChessFlock.Board.View.SVG(ChessFlock.$(".board").first());
    new Beginning(this);
  }, {
    start: function(color) {
      (this.game = new ChessFlock.Game()).join(this.view,color);
    }
  }, [ ChessFlock.UI.Base ] );

}(jQuery));