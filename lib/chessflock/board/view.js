"use strict";
ChessFlock.Board.View = new ChessFlock.Board.Class(function View(){
}, {
  attach: function(game) {
    this.game = game;
    this.game.observe(this);
  }
});
new ChessFlock.Class.Subscope(ChessFlock.Board.View);