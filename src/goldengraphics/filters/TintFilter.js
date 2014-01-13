  // TintFilter (color)
  // TintFilter (r, g, b, a)

  GoldenGraphics.filters.TintFilter = GoldenGraphics.Base.extend({
    init: function(){
      this._super();
      var color = null;

      if(arguments.length == 1){
        color = arguments[0];
      }
      else{
        color = new GoldenGraphics.Color(arguments[0], arguments[1], arguments[2], arguments[3]);
      }

      this.color = color;
      this._prevColor = null;
    },

    apply: function(displayObject) {
      var origin = displayObject._render._context.getImageData(0, 0, displayObject._render._canvas.width, displayObject._render._canvas.height);
      var target = displayObject._render._context.createImageData(origin);

      var pos = 0;
      var inpos = 0;

      var r = parseInt(this.color.r);
      var g = parseInt(this.color.g);
      var b = parseInt(this.color.b);

      var _log = '';

      if(!displayObject._render._chachedFilteredData || !this._prevColor || this._prevColor.r != this.color.r || this._prevColor.g != this.color.g || this._prevColor.b != this.color.b){
        for (var i = 0; i < origin.width; i ++){
          for (var j = 0; j < origin.height; j ++){
            var r_0 = origin.data [inpos++];
            var g_0 = origin.data [inpos++];
            var b_0 = origin.data [inpos++];
            var a_0 = origin.data [inpos++];

            if (a_0 > 0){

              target.data [pos] = r * origin.data [pos] / 255;
              pos ++;
              // _log += r + ' ';
              target.data [pos] = g * origin.data [pos] / 255;
              pos ++;
              target.data [pos] = b * origin.data [pos] / 255;
              pos ++;
              target.data [pos] = origin.data [pos];
              pos ++;
            }
            else{
              pos += 4;
            }
          }
        }

        // console.log(_log);

        if(this._prevColor){
          this._prevColor.r = this.color.r;
          this._prevColor.g = this.color.g;
          this._prevColor.b = this.color.b;
          this._prevColor.a = this.color.a;
        }
        else{
          this._prevColor = new GoldenGraphics.Color(this.color.r, this.color.g, this.color.b, this.color.a);
        }

        displayObject._render._chachedFilteredData = target;


      }


      displayObject._render._context.putImageData(displayObject._render._chachedFilteredData || origin, 0, 0);

      // FIXME temporarily disable filter cache
      displayObject._render._chachedFilteredData = null;

    }
  });
