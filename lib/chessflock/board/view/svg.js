"use strict";
(function($){
  var global = (function(){return this;}());
  var State = Puck.State;

  var c = Dramatis.Continue;

  var transform = function(object,value) {
    $(object).attr("transform",value).data("svgTransform",value);
  };

  var Super = ChessFlock.Board.View;

  ChessFlock.Board.View.SVG =
    new ChessFlock.Board.View.Class(function SVG(element){
      Super.apply(this,arguments);

      this.__state = new State({
        piece_drag_and_drop: new State(
          this.offsets = [], {
            minimum_latency: 10
          })
      }).publish_to(this);

      this.pieces = new ChessFlock.Pieces();
      global.board = this;
      var self = this;
      var after = function() {
        $(self.svg)[0].removeAttribute("height");
        $(self.svg)[0].removeAttribute("width");

        $(self.element).parent().resize(function(){
          self.resize();
        });
        self.resize();

        self.g = $(self.svg).children("g");
        self.positions = [];
        self.populateSquares();
        self._origin = 0;
        self.reset();
        self.g.css("opacity",0.0);
        $(self.svg).find(".piece").css("opacity",0);
        self.disable();
        self.populatePieces();
        if (self.after) {
          self.after();
        }
      };
      self.element = element;
      var original = $(".board svg")[0];
      if (original) {
        $(self.element).append(self.svg = $(original).clone());
        after();
      } else {
        $(element).svg({
          loadURL:"/board.svg",
          onLoad: function(wrapper) {
            self.svg = wrapper.root();
            after();
          }
        });
      }
    }, [
      Super,
      Dramatis.Publisher
    ], {
      _attach: function(game) {
        var self = this;
        var args = arguments;
        var after = function() {
          if (this.cc) {
            Array.prototype.push.call(args, c(this.cc));
          }
          Super.prototype.attach.apply(self,args);
          delete this.cc;
          delete this.after;
        };
        if (this.g) {
          after();
        } else {
          this.cc = Dramatis.Director.current.remove_current_continuation();
          this.after = after;
        }
      },
      resize: function() {
        var parent = $(this.element).parent();

        var height = parent.height();
        var width = parent.width();
        var factor = 0.94;
        var size = Math.min(height,width)*factor;

        parent.css("font-size",size/40);

        var top;
        var left = (width-size)/2;

        if (width > height) {
          top = (height-size)/2;
        } else {
          top = left;
        }

        if (this.left) {
        } else {
          $(this.svg).
            css("left",0).
            css("top",0).
            css("width",size).
            css("height",size);

          $(this.element).
            css("left",left).
            css("top",top).
            css("width",size).
            css("height",size);
        }

      },
      reset: function() {
        if (this.g) {
          transform(this.g.find(".scale"),"scale(1,1)");
          transform(this.g.find(".translate"),"translate(0,0)");
          var box = this.g.get(0).getBBox();
          transform(this.g,"rotate(0,"+(box.width/2)+","+(box.height/2)+")");
          this.redraw();
        }
      },
      disable: function() {
        this.g.animate({"opacity":0.5});
      },
      enable: function() {
        this.g.animate({"opacity":1.0});
      },
      hidePieces: function() {
        // $(".black,.white").not(".square").hide();
      },
      showPieces: function() {
        $(this.svg).find(".piece").css("opacity",1);
      },
      populateSquares: function() {
        var black = this.g.find(".black.square").get(0);
        var white = this.g.find(".white.square").get(0);
        this.squares = [ black, white ];
        var parent = black.parentNode;
        this.size = black.getBBox().width;
        var cx = 0;
        for (var row = 0; row < 8; row++) {
          for (var column = (row === 0 ? 2 : 0); column < 8; column++) {
            var color;
            var offset;
            var delta_x = 0;
            var delta_y = 0;
            if ((row + column) % 2 === 0) {
              color = black;
              offset = row%2;
            } else {
              color = white;
              offset = -row%2;
            }
            var copy = color.cloneNode(true);
            delta_x += this.size*(2*Math.floor(column/2) + offset);
            delta_y += -this.size*row;
            transform(copy,"translate("+delta_x+","+delta_y+")");
            parent.insertBefore(copy,black);
            this.squares.push(copy);
          }
        }
      },
      populatePieces: function() {
        var self = this;
        var max_height = 0;
        var original = ({"black":{},"white":{}});
        self.pieces.each(function(piece){
          var type = piece.type;
          var color = piece.color;
          var set = $(self.g.find("."+color+"."+type));
          var svg = set[0];
          if (!original[color][type]) {
            original[color][type] = [];
            original[color][type][0] = piece;
            var bb = svg.getBBox();
            /* webkit gets the bb wrong; there's a rect in there to force it */
            var rect;
            if ((rect = $(svg).find("rect")[0])) {
              bb = rect.getBBox();
            }
            var height = bb.height;
            if (height > max_height) {
              max_height = height;
            }
          } else {
            var new_svg;
            var n = original[color][type].length;
            if (set[n]) {
              new_svg = set[n];
            } else {
              new_svg = svg.cloneNode(true);
              svg.parentNode.appendChild(new_svg);
            }
            original[color][type].push(new_svg);
            svg = new_svg;
          }
          piece.svg = new ChessFlock.Board.View.SVG.Piece(self,svg,piece);
        });
        self.max_height = max_height;
        self.vertical = (self.size - max_height)/2;
      },
      redraw: function() {
        if (this.pieces) {
          var self = this;
          this.pieces.each(function(piece){
            self.place(piece);
          });
        }
      },
      scale: function(scale,duration,complete) {
        var bbox = this.g[0].getBBox();
        var offset = (1-scale)*bbox.width/2;
        var completed = 0;
        var _complete = function() {
          if (++completed === 2) {
            if (complete) { complete(); }
          }
        };
        this.g.find(".translate").animate({
          svgTransform: "translate("+offset+","+offset+")"
        }, {
          duration: duration,
          queue: false,
          complete: _complete
        });
        this.g.find(".scale").animate({
          svgTransform: "scale("+scale+","+scale+")"
        }, {
          duration: duration,
          queue: false,
          complete: _complete
        });
      },
      rotate: function(degrees, duration, fn) {
        degrees = degrees || 180;
        duration = duration || 1000;
        var self = this;
        var box = this.g.get(0).getBBox();

        var expect = this.pieces.pieces.length;

        var complete = function() {
          if (--expect === 0) {
            self._origin = Math.abs(63-self._origin);
            self.redraw();
            self.reset();
            if (fn) {
              fn();
            }
          }
        };

        self.scale(1/Math.sqrt(2),duration/2);
        if (true) {
          var easing = [ 'swing' ];
          this.g.animate({
            svgTransform: "rotate("+((easing.length > 1)?90:180)+","+(box.width/2)+","+(box.height/2)+")"
          }, {
            duration: easing.length > 1 ? duration/2 : duration,
            easing: easing[0],
            complete: function() {
              if (easing.length > 1) {
                self.g.animate({
                  svgTransform: "rotate(180,"+(box.width/2)+","+(box.height/2)+")"
                }, {
                  duration: duration/2,
                  easing: easing[1],
                  complete: function() {
                    self.scale(1,duration/2,complete);
                  }
                });
              } else {
                self.scale(1,duration/2,complete);
              }
            }
          });
          global.setTimeout(function(){
            self.pieces.each(function(piece){
              piece.svg.rotate(180,duration,complete);
            });
          },duration*0.8);
        }
      },
      place: function(piece, position, animate) {
        // FIX: factor/cleanup
        console.debug("place",piece.position, position, animate);
        var new_position;
        if ((typeof position === "number") && (piece.position !== position)) {
          new_position = position;
          animate = true;
        } else {
          animate = false;
        }
        // Super.prototype.place.apply(this,arguments);
        if (piece.svg) {
          piece.svg.place(new_position, animate);
        }
      },
      page_to_position: function(pageX,pageY) {
        var svg = $(this.svg);
        var svg_bb = svg[0].getBBox();
        var offset = svg.offset();
        var width = svg.width();
        var height = svg.height(); 
        var bs = svg.find(".black.square").last();
        var bb = bs[0].getBBox();

        var x = pageX;
        var y = pageY;
        // console.debug(x,y);

        x = x - offset.left;
        y = y - offset.top;
        // console.debug(x,y);

        x = x / width * svg_bb.width;
        y = y / height * svg_bb.height;
        // console.debug(x,y);

        x = x - svg_bb.x;
        y = y - svg_bb.y;
        // console.debug(x,y);

        x = x-bb.x;
        y = y-bb.y;
        // console.debug(x,y);

        x = x/bb.width;
        y = y/bb.height;
        // console.debug(x,y);

        x = Math.floor(x);
        y = Math.abs(Math.floor(y));
        // console.debug(x,y);

        var position = x+y*8;
        // console.debug(position);

        position = Math.abs(this._origin - position);

        return position;
      },
      page_to_offset: function(view, start, pageX, pageY) {
        var svg = $(this.svg);
        var svg_bb = svg[0].getBBox();
        var offset = svg.offset();
        var width = svg.width();
        var height = svg.height(); 
        var bs = svg.find(".black.square").last();
        var bb = bs[0].getBBox();

        var x = pageX;
        var y = pageY;
        // console.debug(x,y);

        x = x - offset.left;
        y = y - offset.top;
        // console.debug(x,y);

        x = x / width * svg_bb.width;
        y = y / height * svg_bb.height;
        // console.debug(x,y);

        x = x - svg_bb.x;
        y = y - svg_bb.y;
        // console.debug(x,y);

        x = x-bb.x;
        y = y-bb.y;
        // console.debug(x,y);

        x = start[0] - x;
        y = start[1] - y;
        // console.debug(x,y);

        var delta_x = start[0] % bb.width;
        var delta_y = start[1] % bb.height;
        if (delta_y < 0) {
          delta_y = bb.height + delta_y;
        }

        // console.debug("dx",delta_x,delta_y);

        delta_x = -bb.width/2 + delta_x;
        delta_y = -bb.height/2 + delta_y;
        
        var vbb = $(view.svg)[0].getBBox();

        delta_y = delta_y - (this.max_height - vbb.height);

        x = x - delta_x;
        y = y - delta_y;

        return [x,y];
      },
      page_to_board: function(pageX, pageY) {
        var svg = $(this.svg);
        var svg_bb = svg[0].getBBox();
        var offset = svg.offset();
        var width = svg.width();
        var height = svg.height(); 
        var bs = svg.find(".black.square").last();
        var bb = bs[0].getBBox();

        var x = pageX;
        var y = pageY;
        // console.debug(x,y);

        x = x - offset.left;
        y = y - offset.top;
        // console.debug(x,y);

        x = x / width * svg_bb.width;
        y = y / height * svg_bb.height;
        // console.debug(x,y);

        x = x - svg_bb.x;
        y = y - svg_bb.y;
        // console.debug(x,y);

        x = x-bb.x;
        y = y-bb.y;
        // console.debug(x,y);

        return [x,y];
      },
      move: function(start, view, piece) {
        var self = this;
        var svg = $(self.svg);
        global.console.debug(piece.type);
        svg.
          bind("mousemove",function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var position = self.page_to_position(ev.pageX,ev.pageY);
            global.console.debug(position);
            var offset = self.page_to_offset(view, start, ev.pageX, ev.pageY);
            view.offset(offset);
          }).
          bind("mouseup",function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            var position = self.page_to_position(ev.pageX,ev.pageY);
            // FIX: chess rules
            if (self.positions[position]) {
              var nil;
              view.place(nil, true);
            } else {
              self.game.move(view.piece.position, position, c({
                exception: function(reason) {
                  ChessFlock.growl("move failed: "+reason);
                  var nil;
                  view.place(nil, true);
                }
              }));
            }
            svg.unbind("mousemove").unbind("mouseup");
          });
      },
      turn_on: function() {
        var self = this;
        var color = self.state.players[self.index].color;
        var svg = $(self.svg);
        svg.
          bind("mousedown",function(ev){
            var position = self.page_to_position(ev.pageX,ev.pageY);
            global.console.debug(position);
            ev.preventDefault();
            ev.stopPropagation();
            // console.debug(position,$.print(self.positions[0]),$.print(self.positions[63]));
            var view = self.positions[position];
            global.console.debug("v",view);
            if (!view) {
              return;
            }
            var piece = view.piece;
            global.console.debug("PP",piece,piece.color,self.color);
            if (self.color !== piece.color) {
              return;
            }

            var start = self.page_to_board(ev.pageX, ev.pageY);
            global.console.debug("start",$.print(start));
            var offset = self.page_to_offset(view, start, ev.pageX, ev.pageY);
            global.console.debug("off",$.print(offset));
            view.offset(offset);
            
            self.move(start, view, piece);
          });
      },
      turn_off: function() {
        $(this.svg).
          unbind("mousedown").
          unbind("mousemove").
          unbind("mouseup");
      }
    });

  new ChessFlock.Class.Subscope(ChessFlock.Board.View.SVG);

  ChessFlock.Board.View.SVG.Piece =
    ChessFlock.Board.View.SVG.Class(function Piece(view,svg,piece){
      this.view = view;
      this.piece = piece; 
      this.bbox = svg.getBBox();
      var rect;
      if ((rect = $(svg).find("rect")[0])) {
        this.bbox = rect.getBBox();
      }
      this.horizontal = (this.view.size - this.bbox.width)/2;
      this.view.positions[this.piece.position] = this;
      this.svg = svg;
      this.svg_rotate = $(svg).children(".rotate")[0];
      this.center = {x: this.bbox.x+this.bbox.width/2, y: this.bbox.y+this.bbox.height/2};
  }, {
    place: function(new_position, animate) {
      // console.debug("place",new_position,animate,this.piece.position);
      var nil;
      if (new_position !== nil) {
        this.view.positions[this.piece.position] = nil;
        this.view.positions[new_position] = this;
        this.piece.position = new_position;
      }

      var p = Math.abs(this.view._origin - this.piece.position);
      var s = this.view.size;
      this.x = (this.horizontal + (p % 8) * s);
      this.y = -(this.view.vertical + Math.floor(p / 8) * s);
      var translate = "translate("+this.x+","+this.y+")";
      var rotate = "rotate(0,"+(this.center.x)+","+(this.center.y)+")";
      if (animate) {
        $(this.svg).animate({svgTransform: translate}, "normal");
        $(this.svg_rotate).animate({svgTransform: rotate}, "normal");
      } else {
        transform(this.svg,translate);
        transform(this.svg_rotate,rotate);
      }
    },
    offset: function(offset) {
      var p = Math.abs(this.view._origin - this.piece.position);
      var s = this.view.size;
      this.x = (this.horizontal + (p % 8) * s) - offset[0];
      this.y = -(this.view.vertical + Math.floor(p / 8) * s) - offset[1];
      var translate = "translate("+this.x+","+this.y+")";
      transform(this.svg,translate);
      var rotate = "rotate(0,"+(this.center.x)+","+(this.center.y)+")";
      transform(this.svg_rotate,rotate);
    },
    rotate: function(degrees,duration,fn) {
      var self = this;
      var done = 0;
      var complete = function() {
        if (++done === 2) {
          fn();
        }
      };
      if ((self.view.max_height-self.bbox.height) > 0) {
        $(self.svg).animate({
          svgTransform: "translate("+self.x+","+(self.y-(self.view.max_height-self.bbox.height))+")"
        }, {
          duration: duration,
          complete: complete
        });
      }
      $(self.svg_rotate).animate({
        svgTransform: "rotate("+degrees+","+(self.center.x)+","+(self.center.y)+")"
      }, {
        duration: duration,
        complete: complete
      });
    }
  });

}(jQuery));