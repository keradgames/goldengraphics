  // SPRITE

  GoldenGraphics.Sprite = GoldenGraphics.DisplayObjectContainer.extend({
    init: function(image){
      this._super();

      var _this = this;
      this.cachedImageData = null;
      this.position = new GoldenGraphics.Point2D();
      this.filters = [];
      this.opacity = 1;
      this.texture = null;

      function onImageLoad (){
        _this.texture = this;
      }

      image.addEventListener("load", onImageLoad);
    }
  });

  // Static functions and properties

  GoldenGraphics.Sprite.fromImageUrl = function(url){
    var image = new Image();
    var sprite = null;

    image.src = url;
    sprite = new GoldenGraphics.Sprite(image);

    return sprite;
  }
