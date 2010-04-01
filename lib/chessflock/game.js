"use strict";
ChessFlock.Game = new Dramatis.Actor.Type(new ChessFlock.Class(function Game(){
  this.players = [];
  this.players.colors = [];
  this.views = [];
}, [ Dramatis.Publisher ], {
  join: function(view,color) {
    if (this.players.length > 1) {
      throw new Error("this game is full");
    }
    this.players.push(view);
    this.players.colors.push(color);
    this.views.push(view);
    if (this.players.length === 2) {
      this.start();
    }
    view.attach(this);
    this.notify(this.state());
  },
  start: function() {
  },
  state: function() {
    return ({});
  }
}));
