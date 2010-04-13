"use strict";
(function(){
  var global = (function(){return this;}());
  var c = Dramatis.Continue;
  var Actor = Dramatis.Actor;
  ChessFlock.Board.View = new ChessFlock.Board.Class(function View(){
  }, [ Dramatis.Subscriber ], {
    attach: function(game, Continue) {
      var self = this;
      this.game = game;
      this.game.state(c({
        value: [self, function(state) {
          this.state = state;
          this.state_id = void(0);
          this.update_game(state);
          this.subscribe({to: Dramatis.Actor.lifecycle(game), call: "game_event"});
          this.subscribe({to: this.game, call: "update_game"});
        }]
      }));
    },
    game_event: function(ev) {
      throw new Error("implement "+ev);
    },
    update_players: function(state) {
      throw new Error("implement");
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
    update_game: function(diff) {
try{
      global.console.debug("update!", global.$.print(diff));
  if (this.state_id === void(0)) {
    this.state_id = diff.state_id;
  } else {
      if (diff.state_id <= this.state_id) {
        global.console.debug("ignoring delta ("+diff.state_id+") for known state ("+this.state_id+")");
        return;
      }
      this.state_id += 1;
      if (diff.state_id !== this.state_id) {
        throw new Error("out of sync: "+diff.state_id+" "+this.state_id);
      }
  }
      // throw new Error("implement");
  var i;
      if (diff.pieces) {
        if (diff.pieces instanceof Array) {
          for(i=0; i < diff.pieces.length; i++) {
            if (diff.pieces[i] !== void(0)) {
              this.place(this.pieces.pieces[i], diff.pieces[i].position, true);
            }
          }
        } else {
          for(var index in diff.pieces) {
            this.place(this.pieces.pieces[index], diff.pieces[index].position, true);
          }
        }
      }
      if (this.turn === void(0) && typeof diff.turn === "number") {
        this.showPieces();
        this.reset();
      }
      var self = this;
  var old_turn = this.turn;
      var after = function(){
        if (old_turn === void(0) && typeof diff.turn === "number") {
          self.enable();
        }
      };
      if (diff.players) {
        this.state.players = this.state.players || [];
        if(diff.players instanceof Array) {
          for(i=0; i<diff.players.length; i++) {
            this.state.players[i] = diff.players[i];
          }
        } else {
          for(var key in diff.players) {
            this.state.players[key] = diff.players[key];
          }
        }
      }
      if (typeof this.index !== "number") {
        if (this.state.players[0] && this.state.players[1]) {
          if (this.state.players[0].id === Actor.id(this)) {
            this.index = 0;
          } else {
            this.index = 1;
          }
          this.color = this.state.players[this.index].color;
          this[this.color](after);
        }
      } else {
        after();
      }
      if (typeof diff.turn === "number") {
        this.turn = diff.turn;
        if (diff.turn === this.index) {
          this.turn_on();
        } else {
          this.turn_off();
        }
      }
}catch(e){
  global.console.debug("oops",e,e.stack);
}
    },
    update_play: function(state) {
      global.console.debug("update!");
      // console.debug($.print(state.pieces));
      this.state  = state;
      // global.console.debug("update",global.$.print(state));
      // global.console.debug("update",global.$.print(state.turn));
      if (state.pieces) {
        for(var i=0; i<state.pieces.length; i++) {
          this.place(this.pieces.pieces[i], state.pieces[i].position, true);
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
      if (typeof state.turn === "number") {
        if (state.turn === this.index) {
          this.turn_on();
        } else {
          this.turn_off();
        }
      }
    },
    place: function(piece,position) {
      if (position) {
        piece.position = position;
      }
    }
  });
  ChessFlock.Board.View.Name = new Dramatis.Actor.Name.Type(ChessFlock.Board.View);
  new ChessFlock.Class.Subscope(ChessFlock.Board.View);
}());