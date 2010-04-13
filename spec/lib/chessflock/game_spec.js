"use strict";
(function($){
  var global = (function(){return this;}());

  describe("ChessFlock",function(){
    describe("Game",function(){
      var Game = ChessFlock.Game;
      var Actor = Dramatis.Actor;
      var c = Dramatis.Continue;

      it("should be exit",function(){
        expect(ChessFlock.Game).toBeDefined();
      });

      it("should be constructable",function(){
        expect(new ChessFlock.Game()).toBeDefined();
      });

      describe("methods", function(){

        beforeEach(function(){
          this.actor = new ChessFlock.Game();
          this.behavior = Actor.behavior(this.actor);
        });

        describe("positions", function(){
          it("should exist", function(){
            expect(this.behavior.position).toBeDefined();
          });
          it("should return an object", function(){
            expect(this.behavior.position(0)).toBeDefined();
          });
        });

        describe("moves", function(){
          xit("should allow pices to be moved", function(){
            this.behavior.move(3+8,3+8+16);
            expect(this.behavior.position(3+8+16)).toBeDefined();
          });
        });

      });

      describe("state", function(){
        beforeEach(function(){
          new Actor(this);
          Dramatis.extend(this, Dramatis.Subscriber);
          this.actor = new ChessFlock.Game();
          this.behavior = Actor.behavior(this.actor);
        });

        it("should respond with the current state", function() {
          this.actor.state( c([this, function(state) {
            expect(state).toBeDefined();
            expect(state.players).toEqual([]);
            expect(state.pieces.length).toBe(32);
            complete();
          }]));
          incomplete();
        });

        it("should send an update on a move", function() {
          this.actor.state( c([this, function(state) {
            var called = 0;
            this.subscribe({to: this.actor, call: function(delta) {
              called += 1;
              if (called === 1) {
                expect(delta.state_id).toBe(state.state_id);
                this.actor.move(3+8,3+8+16);
              } else {
                expect(delta.state_id).toBe(state.state_id+1);
                global.console.debug("xy",$.print(delta));
                expect(delta.pieces).toEqual({ 11: { position: 27 } });
                complete();
              }
            }});
          }]) );
          incomplete();
        });

      });
    });
  });
}(jQuery));