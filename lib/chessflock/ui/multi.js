"use strict";
(function($){
  var global = (function(){return this;}());
  ChessFlock.UI.Multi = new ChessFlock.UI.Class(function Multi(){
    var uri = ChessFlock.bosh_uri;
    uri = uri.replace(/chessflock:chessflock/,"chess:master");
    uri = uri.replace(/\/[^\/]+$/,"/chessflock");
    // uri = uri.replace(/\/[^\/]+$/,"/chessflock");
    new Dramatis.Actor(this);
    Dramatis.Director.current.register("chessflock",this);
    ChessFlock.UI.Base.call(this, uri);
    this.element = $(".games").first();
    $(global).resize($.proxy(this.resize,this));
    this.views = [];
    this.resize();
  }, [ ChessFlock.UI.Base ], {
    resize: function() {
      var window = $(global);
      var height = window.height();
      var width = window.width();
      var factor = 0.9;
      
      var top;
      var left = (width-width*0.9)/2;

      top = (height-height*0.9)/2;

      if (this.left) {
      } else {
        $(this.element).
          css("left",left).
          css("top",top).
          css("width",width*0.9).
          css("height",height*0.9);
      }
      this.relocate_views();
    },
    relocate_views: function(more) {
      more = more || 0;
      var ar = this.element.width()/this.element.height();
      var number = Math.max(this.views.length+more,1);
      this.placement = {};
      this.placement.col = Math.min(Math.ceil(Math.sqrt(number*ar)),number);
      this.placement.row = Math.ceil(number/this.placement.col);
      // console.debug(ar,number,$.print(this.placement));
      this.placement.width = $(this.element).width()/this.placement.col;
      this.placement.height = $(this.element).height()/this.placement.row;
      this.view_size = Math.min(this.placement.width,this.placement.height);
      for(var i=0; i < this.views.length; i++) {
        this.locate_view(this.views[i],i);
      }
    },
    locate_view: function(pair, index) {
      var div = pair[0], view = pair[1];
      var x = this.placement.width*(index % this.placement.col) +
        (this.placement.width - this.view_size)/2;
      var y = this.placement.height*(Math.floor(index / this.placement.col)) +
        (this.placement.height - this.view_size)/2;
        $(div).
          css("position","absolute");
      if (false) {
        $(div).
          css("width",this.view_size).
          css("height",this.view_size).
          css("position","absolute").
          css("left",x).
          css("top",y);
      } else {
        $(div).animate({
          "width": this.view_size,
          "height":this.view_size,
          "left":x,
          "top":y
        });
      }
    },
    new_view: function() {
      this.relocate_views(1);
      var svg_div;
      var div = $("<div class='game'></div>").
        append( $("<div class='id'></div>") ).
        append( svg_div = $("<div class='board'></div>") ).
        append( $("<div class='opponent'></div>") ).
        appendTo(this.element);
      var view = new Dramatis.Actor(new ChessFlock.Board.View.SVG(svg_div));
      this.views.push([div, view]);
      this.relocate_views();
      return view;
    },
    // N.B.: we're not a game, but we're happy to quack like one ...
    join: function(opponent) {
      var view = this.new_view();
      var game = new ChessFlock.Game();
      game.join(view, Math.random() < 0.5 ? "white" : "black");
      game.join(opponent);

      if (false) {
      if (global.localStorage) {
        global.localStorage.game = JSON.stringify(game);
      }
      }

      var parent = $(Dramatis.Actor.Name.behavior(view).element).parent();
      parent.find(".id").text("Game ID: "+Dramatis.Actor.Name.id(game));
      parent.find(".id").animate({"opacity":1});
      var string = Dramatis.Actor.Name.route(opponent).toString().replace(/^xmpp:/,"");
      parent.find(".opponent").text("Playing "+string);
      parent.find(".id,.opponent").animate({"opacity":1});
      
      return game;
    }
  });
  new ChessFlock.Class.Subscope(ChessFlock.UI.Multi);
}(jQuery));