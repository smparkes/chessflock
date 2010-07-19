"use strict";
(function($){

  var global = (function(){return this;}());
  var choices;

  var c = Dramatis.Continue;
  var Actor = Dramatis.Actor;

  var load_choices = function(callback) {
    var loaded = 0;
    var black;
    var white;
    var after = function(wrapper) {
      wrapper.root().removeAttribute("width");
      wrapper.root().removeAttribute("height");
      $(wrapper.root()).attr("width",0).attr("height",0);
      if (++loaded === 2) {
        choices = {black: $(black).children("svg"), white: $(white).children("svg")};
        $(choices.black).addClass("black");
        $(choices.white).addClass("white");
        callback();
      }
    };

    // NB: firefox get confused if you hide something and then copy it and display.
    // Do invisible via size.

    black = $("<div class='black'></div>").appendTo(global.document.body).svg({
      loadURL:"/black.svg",
      onLoad: after
    });
    white = $("<div class='white'></div>").appendTo(global.document.body).svg({
      loadURL:"/white.svg",
      onLoad: after
    });
  };

  var Beginning = new ChessFlock.Class(function Beginning(ui) {
    this.ui = ui;
    var self = this;
    var after = function(){
      ChessFlock.UI.Dialog.call(self,self.content());
    };
    if (!choices) {
      load_choices(after);
    } else {
      after();
    }
  }, [ ChessFlock.UI.Dialog ], {
    start: function(event) {
      event.stopPropagation();
      var color = $(event.currentTarget).hasClass("black") ? "black" : "white";
      this.ui.start(color);
      this.destroy();
    },
    join: function(event) {
      event.stopPropagation();
      this.ui.join("xmpp:"+this.div.find("input").val());
      this.destroy();
    },
    content: function() {
      if (!this.div) {
        this.div = $("<div class='beginning'></div>");
        this.div.append(
          "<div>Start a new game as</div>"
        );
        var black = $(choices.black).clone().show().click($.proxy(this.start,this));
        var white = $(choices.white).clone().show().click($.proxy(this.start,this));
        var or = $("<div></div>").
          appendTo(this.div).
          append(black).
          append("<span> or </span>").
          append(white);
        
        this.div.append(
          $("<div>or </div>").
            append($("<button>join</button>").click($.proxy(this.join, this))).
            append(" a game with").
            append("<input type='text' value='"+"chess@chessflock/chessflock"+"'></input>"));
        $(this.div).resize($.proxy(this.resize,this));
        this.resize();
      }
      return this.div;
    },
    resize: function() {
      $(this.div).find("svg").
        attr("width",$(this.div).width()/4).
        attr("height",$(this.div).width()/4).
        css("margin",$(this.div).width()/40);
      $(this.div).find("input[type=text]").
        css("font-size",$(this.div).width()/20).
        css("width",$(this.contents).width());
    }
  });

  var Waiting = new ChessFlock.Class(function Beginning(ui) {
    ChessFlock.UI.Dialog.call(this,this.content());
  }, [ ChessFlock.UI.Dialog ], {
    content: function() {
      if (!this.div) {
        this.div = $("<div class='Waiting'>Waiting for an opponent</div>");
      }
      return this.div;
    }
  });

  var Unavailable = new ChessFlock.Class(function Unavailable(ui) {
    ChessFlock.UI.Dialog.call(this,this.content());
    this.ui = ui;
  }, [ ChessFlock.UI.Dialog ], {
    content: function() {
      if (!this.div) {
        var self = this;
        this.div = $("<div class='Unavailable'>Opponent Unavailable</div>").
          append($("<div></div>").append($("<button>Home</button>").click(function(event){
            event.stopPropagation();
            new Beginning(self.ui);
            self.destroy();
          })));
      }
      return this.div;
    }
  });

  ChessFlock.UI.Single = new ChessFlock.UI.Class(function Single(){
    var self = this;
    ChessFlock.UI.call(self, ChessFlock.bosh_uri, function() {
      self.element = $(".game").first();
      $(global).resize($.proxy(self.resize,self));
      self.resize();
      self.view = new Dramatis.Actor(new ChessFlock.Board.View.SVG(self.element.find(".board")));
      self.game = global.localStorage && global.localStorage.game;
      // self.game = nil;
      if (self.game) {
        console.debug("s",self.game,!!self.game);
        self.game = new ChessFlock.Game.Name(Dramatis.JSON.parse(self.game));
        self.element.find(".id .text").text("Game ID: "+Dramatis.Actor.Name.id(self.game));
        self.element.find(".id").animate({"opacity":1});
        self.game.rejoin(self.view, c({
          value: function() {
            self.game.players(c(function(players){
              this.opponent = self.view.equals(players[0].view) ? players[1].view : players[0].view;
              var string = Dramatis.Actor.Name.route(this.opponent).toString().replace(/^xmpp:/,"");
              self.element.find(".opponent").text("Playing "+string).
                append( $("<span class='suffix'><button>resign</button></div>").click(
                  $.proxy(self.resign,self)
                ));
              self.element.find(".id,.opponent").animate({"opacity":1});
            }));
          },
          exception: function(e) {
            if (e instanceof Dramatis.Exception.NoSuchActor) {
              if (global.localStorage) { global.localStorage.removeItem("game"); }
              self.element.find(".id .text,.opponent").text("");
              new Beginning(self);
            } else {
              ChessFlock.growl("exception: "+e);
            }
          }
        }));
      } else {
        new Beginning(self);
      }
    });
  },  [ ChessFlock.UI ], {
    resign: function() {
      this.element.find(".id").animate({"opacity":0});
      this.element.find(".opponent").animate({"opacity":0});
      this.game.resign(this.view);
      new Beginning(this);
/*
      this.view.destroy(c({
        value: [this, function(){
          new Beginning(this);
        }]}));
*/
    },
    resize: function() {
      var window = $(global);
      var height = window.height();
      var width = window.width();
      var factor = 0.9;
      var size = Math.min(height,width)*factor;
      
      var top;
      var left = (width-size)/2;

      if (width > height) {
        top = (height-size)/2;
      } else {
        top = left;
      }

      if (this.left) {
      } else {
        $(this.element).
          css("left",left).
          css("top",top).
          css("width",size).
          css("height",size);
      }
    },
    start: function(color) {
      this.view[color]();
      this.waiting = new Waiting(this);
      (this.game = new ChessFlock.Game()).join(this.view, color);
    },
    join: function(game) {
      var self = this;
      (new ChessFlock.Game.Name(game+"#chessflock")).
        join(self.view, c({
          value: function(game) {
            this.game = game;
            if (global.localStorage) {
              global.localStorage.game = JSON.stringify(game);
            }
            self.element.find(".id .text").text("Game ID: "+Dramatis.Actor.Name.id(game));
            self.element.find(".id").animate({"opacity":1});
            game.players(c(function(players){
              this.opponent = self.view.equals(players[0].view) ? players[1].view : players[0].view;
              var string = Dramatis.Actor.Name.route(this.opponent).toString().replace(/^xmpp:/,"");
              self.element.find(".opponent").text("Playing "+string).
                append( $("<span class='suffix'><button>resign</button></div>").click(
                  $.proxy(self.resign,self)
                ));
              self.element.find(".id,.opponent").animate({"opacity":1});
            }));
          },
          exception: function(exception) {
            // ChessFlock.growl("exception: ("+exception.constructor+")"+exception,"sticky");
            if (exception instanceof Dramatis.Exception.ServiceUnavailable ||
                exception instanceof Dramatis.Exception.NoSuchActor) {
              new Unavailable(self);
            } else {
              ChessFlock.growl("unexpected exception: "+exception+" "+exception.constructor,"sticky");
              global.console.debug(exception.stack);
              new Beginning(self);
            }
          },
          timeout: function(timeout) {
            ChessFlock.growl("timeout: "+timeout);
          }
        }));
    }
  });
}(jQuery));
