// POINT

  GoldenGraphics.Point2D = GoldenGraphics.Base.extend({
    init: function(x, y){
      this._super();

      this.x = x || 0;
      this.y = y || 0;
    }
  })