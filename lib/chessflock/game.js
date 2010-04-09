"use strict";
(function(){
  var Actor = Dramatis.Actor;
  var State = Puck.State;
  var Pieces = ChessFlock.Pieces;
  var global = (function(){return this;}());
  ChessFlock.Game = new Actor.Type(new ChessFlock.Class(function Game(){
    Actor.Behavior.call(this,arguments);

    var self = this;

    this.__state = new State.Aggregate({
      players: new State(this.__players = []),
      pieces: new State(this.__pieces = new Pieces()),
      turn: new State(function(){return self.turn;})
    }).publish_to(this);

    Actor.on_terminate(this, "on_terminate");
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
      for(var i=0; i<this.__players.length; i++) {
        var player_route = Actor.Name.route(this.__players[i].view)+"";
        if (view_route === player_route) {
          this.__players[i].view = view;
          return;
        }
      }
      throw new Error("no match for rejoin");
    },
    join: function(view,color) {
      view = new ChessFlock.Board.View.Name(view);
      if (this.__players.length > 1) {
        throw new Error("this game is full");
      }
      this.__players.push({view: view, color:color});
      this.views.push(view);
      if (this.__players.length === 2) {
        if (this.__players[0].color) {
          this.__players[1].color = this.__players[0].color === "white" ? "black" : "white";
        } else {
          if (!this.__players[1].color) {
            this.__players[1].color = (Math.random() < 0.5) ?  "black" : "white";
          } 
          this.__players[0].color = this.__players[1].color === "white" ? "black" : "white";
        }
        if (this.players[0].color === "white") {
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
      this.notify(this._state());
    },
    players: function() {
      return this.__players;
    },
    position: function(position){
      return this.__pieces.position(position);
    },
    move: function(old_position, new_position) {
      try {
        this.__pieces.move(old_position, new_position);
      } catch(e) {
        Dramatis.raise(e);
      }
      this.turn = 1-this.turn;
      this.__state.pieces.change();
      this.__state.turn.change();
      this.__state.commit();
      // this.notify(this._state());
    },
    _xstate: function() {
      return ({
        players: this.__players,
        pieces: this.pieces && this.pieces._state(),
        turn: this.turn
      });
    }
  }));
}());