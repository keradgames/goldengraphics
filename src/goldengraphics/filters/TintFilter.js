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
    },

    apply: function(origin, target) {
      var pos = 0;
      var inpos = 0;

      var r = this.color.r;
      var g = this.color.g;
      var b = this.color.b;

      var _log = "";

      for (var i = 0; i < origin.width; i ++){
        for (var j = 0; j < origin.height; j ++){
          var r_0 = origin.data [inpos++];
          var g_0 = origin.data [inpos++];
          var b_0 = origin.data [inpos++];
          var a_0 = origin.data [inpos++];

          if (a_0 > 0){
            target.data [pos] = r * origin.data [pos] / 255;
            pos ++;
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
    }
  });
