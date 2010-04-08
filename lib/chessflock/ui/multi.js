"use strict";
(function($){
  var global = (function(){return this;}());
  var Actor = Dramatis.Actor;
  var c = Dramatis.Continue;
  var Discard = Dramatis.Discard;
  ChessFlock.UI.Multi = new ChessFlock.UI.Class(function Multi(){
    this.unclaimed_views = [];
    // global.localStorage.clear();
    var uri = ChessFlock.bosh_uri;
    uri = uri.replace(/chessflock:chessflock/,"chess:master");
    uri = uri.replace(/\/[^\/]+$/,"/chessflock");
    // uri = uri.replace(/\/[^\/]+$/,"/chessflock");
    new Actor(this);
    Actor.register(this, "chessflock");
    ChessFlock.UI.call(this, uri);
    this.element = $(".games").first();
    $(global).resize($.proxy(this.resize,this));
    this.restore_views();
    this.resize();
  }, [ ChessFlock.UI,
       Dramatis.Subscriber
     ], {
       drop_game: function(id) {
         if (global.localStorage) {
           games = global.localStorage.games;
           if (games) {
             games = Dramatis.JSON.parse(games);
           }
           if (games) {
             delete games[id];
             global.localStorage.games = JSON.stringify(games);
           }
         }
       },
       restore_views: function() {
         var self = this;
         self.views = [];
         if (global.localStorage) {
           games = global.localStorage.games;
           if (games) {
             games = Dramatis.JSON.parse(games);
             var each_game = function(id) {
               var game = new ChessFlock.Game.Name(parseInt(id,10));
               var view = self.new_view();
               game.rejoin(view, c({
                 exception: [self, function(e) {
                   self.unclaimed_views.push(view);
                   if (e instanceof Dramatis.Exception.NoSuchActor) {
                     self.drop_game(id);
                   } else {
                     ChessFlock.growl("Fail on restore: "+e,"sticky");
                   }
                 }]
               }));
             };
             for(var id in games) {
               each_game(id);
             }
           }
         }
       },
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
         var view = this.unclaimed_views.shift();
         if (view) {
           return view;
         }
         this.relocate_views(1);
         var svg_div;
         var div = $("<div class='game'></div>").
           append( $("<div class='id'></div>") ).
           append( svg_div = $("<div class='board'></div>") ).
           append( $("<div class='opponent'></div>") ).
           appendTo(this.element);
         view = new Actor(new ChessFlock.Board.View.SVG(svg_div));
         this.subscribe({to: Actor.lifecycle(view), call: "view_event"});
         this.views.push([div, view]);
         this.relocate_views();
         return view;
       },
       view_event: function(ev) {
         throw new Error("implement");
       },
       game_event: function(ev) {
         throw new Error("implement");
       },
       // N.B.: we're not a game, but we're happy to quack like one ...
       join: function(opponent) {
         var opponent_route = Actor.Name.route(opponent).toString().replace(/^xmpp:/,"");
         var game_id;

         if (global.localStorage) {
           game_id = parseInt(global.localStorage[opponent_route],10);
           if (game_id) {
             console.debug("abandoning game "+game_id);
             global.localStorage.removeItem(opponent_route);
             (new ChessFlock.Game.Name(game_id)).destroy(c({
               exception: Discard // ? discard(NoSuchActor)
             }));
           }
         }

         var nil;
         var view = this.new_view();
         var game = new ChessFlock.Game();
         this.subscribe({to: Actor.lifecycle(game), call: "game_event"});
         game_id = Actor.Name.id(game);

         if (global.localStorage) {
           console.debug("recording game "+game_id+" for "+opponent_route);
           global.localStorage[opponent_route] = game_id;

           var games = global.localStorage.games;
           if (games) {
             games = Dramatis.JSON.parse(games);
           } else {
             games = {};
           }

           games[game_id] = (new Date).getTime();

           global.localStorage.games = JSON.stringify(games);
         }

         // game.join(view, Math.random() < 0.5 ? "white" : "black");
         game.join(view, Math.random() < 0.5 ? "black" : "black");
         game.join(opponent);

         var parent = $(Actor.Name.behavior(view).element).parent();
         parent.find(".id").text("Game ID: "+game_id);
         parent.find(".id").animate({"opacity":1});
         parent.find(".opponent").text("Playing "+opponent_route);
         parent.find(".id,.opponent").animate({"opacity":1});
         
         return game;
       }
     });
  new ChessFlock.Class.Subscope(ChessFlock.UI.Multi);
}(jQuery));