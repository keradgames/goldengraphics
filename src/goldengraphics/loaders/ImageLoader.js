/**
 * Derived from PIXI.ImageLoader @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The image loader class is responsible for loading images file formats ("jpeg", "jpg", "png" and "gif")
 * Once the image has been loaded it is stored in the PIXI texture cache and can be accessed though PIXI.Texture.fromFrameId() and PIXI.Sprite.fromFromeId()
 * When loaded this class will dispatch a 'loaded' event
 *
 * @class ImageLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the image
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
GoldenGraphics.ImageLoader = GoldenGraphics.Base.extend({
  init: function(url, crossorigin){
    PIXI.EventTarget.call(this);
    this.url = url;
  },

  /**
   * Loads image or takes it from cache
   *
   * @method load
   */
  load: function(){
    // TODO cache textures
    var _this = this;

    if(GoldenGraphics.BaseTexture.cache[this.url]){
      this.img = GoldenGraphics.BaseTexture.cache[this.url];
      this.onLoaded();
    }
    else{
      var xhr = new XMLHttpRequest();
      this.img = new Image();

      this.img.addEventListener("load", function(){
        GoldenGraphics.BaseTexture.cache[_this.url] = _this.img;
        _this.onLoaded();
      });

      this.img.addEventListener("error", function(){
        _this.onError();
      });

      xhr.onload = function(){
        var url = window.URL || window.webkitURL;
        _this.img.src = url.createObjectURL(this.response);
      }

      xhr.open('GET', this.url, true);
      xhr.responseType = 'blob';
      xhr.onerror = function(error) {
        _this.onError();
      }
      xhr.send();
    }

  },

  /**
   * Invoked when image file is loaded or it is already cached and ready to use
   *
   * @method onLoaded
   * @private
   */
  onLoaded: function(){
    this.dispatchEvent({type: "loaded", content: this});
  },

  /**
   * Invoked when there is an error loading one of the images
   *
   * @method onError
   * @private
   */
  onError: function(){
    this.dispatchEvent({type: "error", content: this});
  }

})

