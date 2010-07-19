"use strict";
(function($){
  var Actor = Dramatis.Actor;
  var Pieces = ChessFlock.Pieces;
  var global = (function(){return this;}());
  var Same = ({});
  var None = ({});
  var Deleted = ({});
  ChessFlock.Game = new Actor.Type(new ChessFlock.Class(function Game(/*...*/){
    Actor.Behavior.call(this, arguments);

    if (arguments.length === 0) {
      this.state_id = 0;
      this.__players = [];
      this.__pieces = new Pieces();
      this.turn = void(0);
      this.views = [];
      this.commit();
    } else {
    }

    Actor.on_terminate(this, "on_terminate");
  }, [ Dramatis.Publisher ], {
    on_terminate: function() {
      if (global.localStorage) {
        var id = Actor.id(this);
        global.localStorage.removeItem(id);
      }
    },
    resign: function(player) {
      if (Actor.id(player) === Actor.id(this.__players[0].view)) {
        this.winner = this.__players[1].color;
      } else {
        this.winner = this.__players[0].color;
      }
      this.turn = void(0);
      this.commit();
      this.destroy();
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
          view.send("attach",[Actor.actor_name(this)]);
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
        if (this.__players[0].color === "white") {
          this.turn = 0;
        } else {
          this.turn = 1;
        }
      }
      view.attach(Actor.actor_name(this));
      this.commit();
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
        global.console.debug(e,e.stack);
        Dramatis.raise(e);
      }
      this.turn = 1-this.turn;
      this.commit();
    },
    commit: function() {
      // console.debug("commit",this.state_id);
      this.state_id += 1;

      if (global.localStorage) {
        var id = Actor.id(this);
        // global.localStorage[id] = JSON.stringify(this);
      }

      var old_state = this.current_state;
      this.current_state = this.compute_state();
      this.notify(this.diff(old_state, this.current_state));
    },
    diff: function(old_state, new_state) {
      // console.debug("diff",$.print(arguments));
try {
      if (old_state === void(0) || (typeof old_state !== typeof new_state)) {
//         console.debug("void"); 
        return new_state;
      }

      if (old_state === new_state) {
        return Same;
      }

      switch(typeof new_state) {
       case "string":
       case "number":
        return new_state;
      }

      var diff = {};
      var different = false;
      
      for(var key in new_state) {
        if (key in old_state) {
          var field_diff = this.diff(old_state[key], new_state[key]);
          if (field_diff !== Same) {
            // console.debug("add",key,field_diff);
            diff[key] = field_diff;
            different = true;
          }
        } else {
          // console.debug("addy",key,new_state[key]);
          different = true;
          diff[key] = new_state[key];
        }
      }

      for(key in old_state) {
        if (!(key in new_state)) {
          // console.debug("delk",key,Deleted);
          diff[key] = Deleted;
          different = true;
        }
      }

  if (!different) {
    return Same;
    }
  return diff;
}catch(e){
global.console.debug("!!!",e,e.stack);
throw e;
}
    },
    flatten: function(object) {
      switch(typeof object) {
       case "function":
        return None;
       case "undefined":
       case "number":
       case "string":
        return object;
       case "object":
        if (object instanceof String) {
          return object.toString();
        }

        if (object.toJSON) {
          return this.flatten(object.toJSON());
        }

        var result = {};
        if (object instanceof Array) {
          result = [];
        }
        for(var key in object) {
          var value = this.flatten(object[key]);
          if (value !== None) {
            result[key] = value;
          }
        }
        return result;
      default:
        throw new Error("implement game flatten "+global.$.print(object));
      }
    },
    compute_players: function() {
      var players = [];
      for(var i=0; i < this.__players.length; i++) {
        players[i] = {
          uri: Actor.Name.uri(this.__players[i].view),
          color: this.__players[i].color
        };
      }
      return players;
    },
    compute_state: function() {
      return this.flatten({
        state_id: this.state_id,
        turn: this.turn,
        players: this.compute_players(),
        pieces: this.__pieces,
        winner: this.winner
      });
    },
    state: function() {
      return this.current_state;
    },
    _toJSON: function() {
      // console.debug("gtj");
      var json = {
        "__jsonclass__": [
          this.constructor+"",
          Actor.uri(this),
          this.state_id,
          this.compute_players(),
          this.views,
          this.__pieces,
          this.turn
      ]};
      // console.debug($.print(json));
      return json;
    }
  }));
  ChessFlock.Game._fromJSON = function(args) {
    return new ChessFlock.Game(args);
    /*
    var game = new Game(args[0]);
    game.state_id = args[1];
    game.__players = new players(args[2]);
    game.__pieces = new Pieces(args[3]);
    game.views = new views;
    game.turn = args[4];
*/
  };
}(jQuery));