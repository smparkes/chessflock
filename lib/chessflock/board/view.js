"use strict";
ChessFlock.Board.View = new ChessFlock.Board.Class(function View(){
}, [ Dramatis.Subscriber ], {
  attach: function(game) {
    this.game = game;
    this.subscribe({to: this.game, call: "update"});
  },
  white: function() {
    this.origin(0);
  },
  black: function() {
    this.origin(63);
  },
  origin: function(new_origin) {
    var populated = false;
    if (!this.pieces) {
      populated = true;
      this.populatePieces();
      this.showPieces();
      this.reset();
    }
    if(new_origin !== this._origin) {
      if (populated) {
        var self = this;
        setTimeout(function(){
          self.rotate();
        }, 500);
      } else {
        this.rotate();
      }
    }
  },
  swap: function() {
    this.origin(Math.abs(63-this._origin));
  },
  update: function(state) {
    if (!this.color) {
    }
  }
});
new ChessFlock.Class.Subscope(ChessFlock.Board.View);