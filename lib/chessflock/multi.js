"use strict";
(function($){
  $(function(){
    $(".games .board").svg({
      loadURL:"/board.svg",
      onLoad: function(wrapper) {
        ChessFlock.Board.View.SVG.svg = wrapper.root();
        new ChessFlock.UI.Multi();
      }
    });
  });
}(jQuery));
