"use strict";
ChessFlock.Board.View = new ChessFlock.Board.Class(function View(){
}, [ Dramatis.Subscriber ], {
  attach: function(game, Continue) {
    this.game = game;
    this.subscribe({to: this.game, call: "update"}, Continue || Dramatis.CallCC);
  },
  white: function(fn) {
    this.origin(0,fn);
  },
  black: function(fn) {
    this.origin(63,fn);
  },
  origin: function(new_origin,fn) {
    var populated = false;
    if (!this.pieces) {
      populated = true;
      this.populatePieces();
      this.showPieces();
      this.reset();
    }
    var nil;
    if(new_origin !== this._origin) {
      if (populated) {
        var self = this;
        var global = (function(){return this;}());
            global.setTimeout(function(){
              self.rotate(nil,nil,fn);
            }, 500);
      } else {
        this.rotate(nil,nil,fn);
      }
    } else {
      if (fn) {
        fn();
      }
    }
  },
  swap: function(fn) {
    this.origin(Math.abs(63-this._origin),fn);
  },
  update: function(state) {
    console.debug("update!");
    this.state  = state;
    var global = (function(){return this;}());
    // global.console.debug("update",global.$.print(state));
    // global.console.debug("update",global.$.print(state.turn));
    if (state.pieces) {
      for(var i=0; i<state.pieces.length; i++) {
        this.place(this.pieces.pieces[i], state.pieces[i].position);
      }
    }
    if (typeof state.turn === "number") {
      this.showPieces();
      this.reset();
    }
    var self = this;
    var after = function(){
      if (typeof state.turn === "number") {
        self.enable();
      }
    };
    if (typeof this.index !== "number") {
      if (state.players[0] && state.players[1]) {
        if (state.players[0].equals(this)) {
          this.index = 0;
        } else {
          this.index = 1;
        }
        this[state.colors[this.index]](after);
      }
    } else {
      after();
    }
    if (state.turn) {
      if (state.turn == this.index) {
        this.turn_on();
      } else {
        this.turn_off();
      }
    }
  }, place: function(piece,position) {
    if (position) {
      piece.position = position;
    }
  }, color: function() {
    var color;
    if (this.index && this.state && this.state.colors) {
      color = this.state.colors[this.index];
    }
    return color;
  }
});
ChessFlock.Board.View.Name = new Dramatis.Actor.Name.Type(ChessFlock.Board.View);
new ChessFlock.Class.Subscope(ChessFlock.Board.View);