  // SPRITE

  GoldenGraphics.Sprite = GoldenGraphics.DisplayObjectContainer.extend({
    init: function(image){
      this._super();

      var _this = this;
      this.cachedImageData = null;
      // this.texture = null;

      this.texture = image;

      // function onImageLoad (){
      //   _this.texture = this;
      // }

      // image.addEventListener("load", onImageLoad);
    }
  });

  // Static functions and properties

  GoldenGraphics.Sprite.fromImageUrl = function(url){
    var image = GoldenGraphics.BaseTexture.cache[url] || new Image();
    var sprite = null;
    image.src = image.src || url;

    sprite = new GoldenGraphics.Sprite(image);

    return sprite;
  }
