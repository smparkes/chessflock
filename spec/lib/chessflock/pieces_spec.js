"use strict";
describe("ChessFlock",function(){
  describe("Pieces",function(){
    var Pieces = ChessFlock.Pieces;
    var Piece = ChessFlock.Piece;

    it("should be exit",function(){
      expect(ChessFlock.Pieces).toBeDefined();
    });

    it("should be constructable",function(){
      expect(new ChessFlock.Pieces()).toBeDefined();
    });

    describe("methods", function(){

      beforeEach(function(){
        this.pieces =new ChessFlock.Pieces();
      });

      describe("positions", function(){
        it("should exist", function(){
          expect(this.pieces.position).toBeDefined();
        });
        it("should return an object", function(){
          expect(this.pieces.position(0)).toBeDefined();
        });
        it("should return a piece", function(){
          expect(this.pieces.position(0) instanceof Piece).toBe(true);
        });
        it("should return the right piece", function(){
          var piece = this.pieces.position(0);
          expect(piece.color).toBe("white");
          expect(piece.type).toBe("rook");
        });
        it("should know its place", function(){
          expect(this.pieces.position(0).position).toBe(0);
        });
      });

      describe("moves", function(){
        it("should allow pices to be moved", function(){
          this.pieces.move(3+8,3+8+16);
          expect(this.pieces.position(3+8+16)).toBeDefined();
        });
      });

    });

    describe("state", function(){
    });

  });
});