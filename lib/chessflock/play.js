"use strict";
(function($){
  $(function(){
    $(".game").first().find(".board").svg({
      loadURL:"/board.svg",
      onLoad: function(wrapper) {
        ChessFlock.Board.View.SVG.svg = wrapper.root();
        new ChessFlock.UI.Single();
      }
    });
  });
}(jQuery));