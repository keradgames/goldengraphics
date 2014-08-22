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
  init: function(url, crossorigin) {
    PIXI.EventTarget.call(this);
    this.url = url;
  },

  /**
   * Loads image or takes it from cache
   *
   * @method load
   */
  load: function() {
    var cachedImg;

    // if texture is loaded, get it from textures cache
    if (cachedImg = GoldenGraphics.BaseTexture.cache[this.url]) {
      this.img = cachedImg;
      this.onLoaded();
    } else if (cachedImg = GoldenGraphics.ImageLoader._assets_cache_[this.url]) {
      // if texture has been request but it's not loaded yet, avoid duplicated request
      cachedImg.addEventListener("load", this.onLoaded.bind(this));
      cachedImg.addEventListener("error", this.onError.bind(this));
    } else {
      var xhr = new XMLHttpRequest();
      this.img = new Image();

      GoldenGraphics.ImageLoader._assets_cache_[this.url] = this.img;

      this.img.addEventListener("load", function() {
        GoldenGraphics.BaseTexture.cache[this.url] = this.img;
        this.onLoaded();
      }.bind(this));

      this.img.addEventListener("error", this.onError.bind(this));

      xhr.onload = function() {
        var url = window.URL || window.webkitURL;
        this.img.src = url.createObjectURL(xhr.response);
      }.bind(this);

      xhr.open('GET', this.url, true);
      xhr.responseType = 'blob';
      xhr.onerror = function(error) {
        this.onError();
      }.bind(this);
      xhr.send();
    }
  },

  /**
   * Invoked when image file is loaded or it is already cached and ready to use
   *
   * @method onLoaded
   * @private
   */
  onLoaded: function() {
    this.dispatchEvent({
      type: "loaded",
      content: this
    });
  },

  /**
   * Invoked when there is an error loading one of the images
   *
   * @method onError
   * @private
   */
  onError: function() {
    this.dispatchEvent({
      type: "error",
      content: this
    });
  }

});

/**
 * A static cache for all the requested assets.
 * @type {Object}
 */
GoldenGraphics.ImageLoader._assets_cache_ = {};