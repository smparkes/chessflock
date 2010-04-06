"use strict";
(function($){
  var global = (function(){return this;}());
  ChessFlock.UI.Multi = new ChessFlock.UI.Class(function Multi(){
    var uri = ChessFlock.bosh_uri;
    uri = uri.replace(/chessflock:chessflock/,"chess:master");
    uri = uri.replace(/\/[^\/]+$/,"/chessflock");
    // uri = uri.replace(/\/[^\/]+$/,"/chessflock");
    new Dramatis.Actor(this);
    Dramatis.Director.current.register("chessflock",this);
    ChessFlock.UI.Base.call(this, uri);
    this.element = $(".games").first();
    $(global).resize($.proxy(this.resize,this));
    this.resize();
    this.views = [];
  }, [ ChessFlock.UI.Base ], {
    resize: function() {
      var window = $(global);
      var height = window.height();
      var width = window.width();
      var factor = 0.9;
      
      var top;
      var left = (width-width*.9)/2;

      top = (height-height*.9)/2;

      if (this.left) {
      } else {
        $(this.element).
          css("left",left).
          css("top",top).
          css("width",width*.9).
          css("height",height*.9);
      }
      this.relocate_views();
    },
    relocate_views: function(more) {
      console.debug("ar",this.element.width()/this.element.height());
    },
    new_view: function() {
      var div = $("<div class='game'></div>").
        append( $("<div class='id'></div>") ).
        append( $("<div class='board'></div>") ).
        append( $("<div class='opponent'></div>") ).
        appendTo(this.element);
      var view = new Dramatis.Actor(new ChessFlock.Board.View.SVG(div));
      this.views.push(view);
      return view;
    },
    // N.B.: we're not a game, but we're happy to quack like one ...
    join: function(opponent) {
      var view = this.new_view();
      var game = new ChessFlock.Game();
      game.join(view, Math.random() < 0.5 ? "white" : "black");
      game.join(opponent);
      return game;
    }
  });
  new ChessFlock.Class.Subscope(ChessFlock.UI.Multi);
}(jQuery));