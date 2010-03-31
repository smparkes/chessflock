"use strict";
ChessFlock.Board.View = new ChessFlock.Board.Class(function View(){
}, [ Dramatis.Subscriber ], {
  attach: function(game) {
    this.game = game;
    this.subscribe({to: this.game, call: "update"});
  }
});
new ChessFlock.Class.Subscope(ChessFlock.Board.View);