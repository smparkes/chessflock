"use strict";
(function($){
  var global = (function(){return this;}());

  describe("ChessFlock",function(){
    describe("View",function(){
      var View = ChessFlock.Board.View;

      it("should be exit",function(){
        expect(View).toBeDefined();
      });

      it("should be constructable",function(){
        expect(new View()).toBeDefined();
      });

      it("should tostring to the right value",function(){
        expect(View+"").toBe("ChessFlock.Board.View");
      });

    });
  });
}(jQuery));