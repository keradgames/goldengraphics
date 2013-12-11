  // SPRITE

  GoldenGraphics.Sprite = GoldenGraphics.DisplayObjectContainer.extend({
    init: function(image){
      this._super();

      var _this = this;
      this.cachedImageData = null;
      // this.texture = null;

      if(image.complete){
        onImageLoad();
      }
      else{
        image.addEventListener("load", onImageLoad);
      }

      function onImageLoad (){
        _this.texture = image;
      }

    }
  });

  // Static functions and properties

  GoldenGraphics.Sprite.fromImageUrl = function(url){
    var image = GoldenGraphics.BaseTexture.cache[url] || new Image();
    var sprite = null;

    if(!image.src){
      image.src = url;
    }

    sprite = new GoldenGraphics.Sprite(image);

    return sprite;
  }
