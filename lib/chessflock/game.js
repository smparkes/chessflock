"use strict";
(function(){
  var Actor = Dramatis.Actor;
  var global = (function(){return this;}());
  ChessFlock.Game = new Actor.Type(new ChessFlock.Class(function Game(){
    Actor.Behavior.call(this,arguments);
    Actor.on_terminate(this, "on_terminate");
    this._players = [];
    this.colors = [];
    this.views = [];
  }, [ Dramatis.Publisher ], {
    on_terminate: function() {
      if (global.localStorage) {
        var id = Actor.id(this);
        global.localStorage.removeItem(id);
      }
    },
    destroy: function() {
      Actor.terminate(this);
    },
    rejoin: function(view) {
      var view_route = Actor.Name.route(view)+"";
      for(var i=0; i<this._players.length; i++) {
        var player_route = Actor.Name.route(this._players[i])+"";
        console.debug("comp",view_route,player_route);
        if (view_route === player_route) {
          this._players[i] = view;
          return;
        }
      }
      throw new Error("no match for rejoin");
    },
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
    move: function(old_position, new_position) {
      this.pieces.move(old_position, new_position);
      this.turn = 1-this.turn;
      this.notify(this._state());
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
}());