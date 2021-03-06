"use strict";
(function($){
  var global = (function(){return this;}());

  describe("ChessFlock",function(){
    describe("View",function(){
      describe("SVG",function(){
        var SVG = ChessFlock.Board.View.SVG;

        beforeEach(function(){
          $(".board svg").remove();
          $(global.document.body).
            append("<div class='board'><svg></svg></div>");
          SVG.svg = $(".board svg");
          spyOn(SVG.prototype,"populateSquares");
          spyOn(SVG.prototype,"populatePieces");
          spyOn(SVG.prototype,"reset");
        });

        it("should be exit",function(){
          expect(SVG).toBeDefined();
        });
        
        it("should be constructable",function(){
          expect(new SVG()).toBeDefined();
        });

        it("should tostring to the right value",function(){
          expect(SVG+"").toBe("ChessFlock.Board.View.SVG");
        });

        it("should tostring to the right value",function(){
          expect((new SVG()).constructor+"").toBe("ChessFlock.Board.View.SVG");
          expect(SVG.prototype.constructor+"").toBe("ChessFlock.Board.View.SVG");
        });
      });
    });
  });
}(jQuery));