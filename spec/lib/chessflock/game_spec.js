"use strict";
describe("ChessFlock",function(){
  describe("Game",function(){
    var Game = ChessFlock.Game;
    var Actor = Dramatis.Actor;

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
        it("should allow pices to be moved", function(){
          this.behavior.move(3+8,3+8+16);
          expect(this.behavior.position(3+8+16)).toBeDefined();
        });
      });

    });

    describe("state", function(){
    });

  });
});