"use strict";
ChessFlock.Game = new Dramatis.Actor.Type(new ChessFlock.Class(function Game(){
  this._players = [];
  this.colors = [];
  this.views = [];
}, [ Dramatis.Publisher ], {
  join: function(view,color) {
    view = new ChessFlock.Board.View.Name(view);
    if (this._players.length > 1) {
      throw new Error("this game is full");
    }
    this._players.push(view);
    this.colors.push(color);
    this.views.push(view);
    if (this._players.length === 2) {
      if (this.colors[0]) {
        this.colors[1] = this.colors[0] === "white" ? "black" : "white";
      } else {
        if (!this.colors[1]) {
          this.colors[1] = (Math.random() < 0.5) ?  "black" : "white";
        } 
        this.colors[0] = this.colors[1] === "white" ? "black" : "white";
      }
      if (this.colors[0] === "white") {
        this.turn = 0;
       } else {
        this.turn = 1;
       }
      this.start();
    }
    view.attach(this);
    this.notify(this._state());
  },
  start: function() {
    this.pieces = new ChessFlock.Pieces();
    this.notify(this._state());
  },
  players: function() {
    return this._players;
  },
  _state: function() {
    return ({
      players: this._players,
      colors: this.colors,
      pieces: this.pieces && this.pieces._state(),
      turn: this.turn
    });
  }
}));
