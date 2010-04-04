"use strict";
(function($){
  ChessFlock.UI.Multi = new ChessFlock.UI.Class(function Multi(){
    var uri = ChessFlock.bosh_uri;
    uri = uri.replace(/chessflock:chessflock/,"chess:master");
    uri = uri.replace(/\/[^\/]+$/,"/chessflock");
    // uri = uri.replace(/\/[^\/]+$/,"/chessflock");
    new Dramatis.Actor(this);
    Dramatis.Director.current.register("chessflock",this);
    ChessFlock.UI.Base.call(this, uri);
  }, [ ChessFlock.UI.Base ], {
    // N.B.: we're not a game, but we're happy to quack like one ...
    join: function(opponent) {
      var view =
        new Dramatis.Actor(new ChessFlock.Board.View.SVG($(".board").first()));
      var game = new ChessFlock.Game();
      game.join(view,"white");
      game.join(opponent);
      return game;
    }
  });
  new ChessFlock.Class.Subscope(ChessFlock.UI.Multi);
}(jQuery));