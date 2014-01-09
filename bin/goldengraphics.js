// Copyright (c) 2014 Kerad Games S. L. 
 // goldengraphics 2014-01-09 
  /* The MIT License (MIT) 
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: 

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. 

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */ 
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * @module PIXI
 */
var PIXI = PIXI || {};

/**
 * https://github.com/mrdoob/eventtarget.js/
 * THankS mr DOob!
 */

/**
 * Adds event emitter functionality to a class
 *
 * @class EventTarget
 * @example
 *		function MyEmitter() {
 *			PIXI.EventTarget.call(this); //mixes in event target stuff
 *		}
 *
 *		var em = new MyEmitter();
 *		em.emit({ type: 'eventName', data: 'some data' });
 */
PIXI.EventTarget = function () {

	var listeners = {};

	this.addEventListener = this.on = function ( type, listener ) {


		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );
		}

	};

	this.dispatchEvent = this.emit = function ( event ) {

		for ( var listener in listeners[ event.type ] ) {
			if(listeners[ event.type ].hasOwnProperty(listener)){
				listeners[ event.type ][ listener ]( event );
			}
		}

	};

	this.removeEventListener = this.off = function ( type, listener ) {

		var index = listeners[ type ].indexOf( listener );

		if ( index !== - 1 ) {

			listeners[ type ].splice( index, 1 );

		}

	};

};



(function(exports){
  var GoldenGraphics = {};

  // FILTERS

  GoldenGraphics.filters = {};


/* Simple JavaScript Inheritance
   * By John Resig http://ejohn.org/
   * MIT Licensed.
   */
  // Inspired by base2 and Prototype
  (function(){
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
      var _super = this.prototype;

      // Instantiate a base class (but only create the instance,
      // don't run the init constructor)
      initializing = true;
      var prototype = new this();
      initializing = false;

      // Copy the properties over onto the new prototype
      for (var name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" &&
          typeof _super[name] == "function" && fnTest.test(prop[name]) ?
          (function(name, fn){
            return function() {
              var tmp = this._super;

              // Add a new ._super() method that is the same method
              // but on the super-class
              this._super = _super[name];

              // The method only need to be bound temporarily, so we
              // remove it when we're done executing
              var ret = fn.apply(this, arguments);
              this._super = tmp;

              return ret;
            };
          })(name, prop[name]) :
          prop[name];
      }

      // The dummy class constructor
      function Class() {
        // All construction is actually done in the init method
        if ( !initializing && this.init )
          this.init.apply(this, arguments);
      }

      // Populate our constructed prototype object
      Class.prototype = prototype;

      // Enforce the constructor to be what we expect
      Class.prototype.constructor = Class;

      // And make this class extendable
      Class.extend = arguments.callee;

      return Class;
    };
  })();
// CORE

  GoldenGraphics.Base = Class.extend({
    init : function(){}
  });

// COLOR

  GoldenGraphics.Color = GoldenGraphics.Base.extend({
    init: function(r, g, b, a){
      this._super();

      this.r = r || 0;
      this.g = g || 0;
      this.b = b || 0;
      this.a = a != undefined ? a : 1;
    },

    multiply: function(color) {
      return color;
    }
  });

  // Static functions

  GoldenGraphics.Color.fromHex = function(hex){
    var color = null;
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if(result){
      color = new GoldenGraphics.Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16));
    }

    return color;
  };

// POINT

  GoldenGraphics.Point2D = GoldenGraphics.Base.extend({
    init: function(x, y){
      this._super();

      this.x = x || 0;
      this.y = y || 0;
    }
  })
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
      this.img = new Image();
      this.img.addEventListener("load", function(){
        GoldenGraphics.BaseTexture.cache[_this.url] = _this.img;
        _this.onLoaded();
      });

      this.img.addEventListener("error", function(){
        _this.onError();
      });

      this.img.src = this.url;
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


/**
 * Derived from PIXI.AssetLoader @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Class that loads a bunch of images / sprite sheet / bitmap font files. Once the
 * assets have been loaded they are added to the PIXI Texture cache and can be accessed
 * easily through PIXI.Texture.fromImage() and PIXI.Sprite.fromImage()
 * When all items have been loaded this class will dispatch a "onLoaded" event
 * As each individual item is loaded this class will dispatch a "onProgress" event
 *
 * @class AssetLoader
 * @constructor
 * @uses EventTarget
 * @param {Array<String>} assetURLs an array of image/sprite sheet urls that you would like loaded
 *      supported. Supported image formats include "jpeg", "jpg", "png", "gif". Supported
 *      sprite sheet data formats only include "JSON" at this time. Supported bitmap font
 *      data formats include "xml" and "fnt".
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */

/**
 * Fired when an item has loaded
 * @event onProgress
 */

/**
 * Fired when all the assets have loaded
 * @event onComplete
 */

GoldenGraphics.AssetLoader = GoldenGraphics.Base.extend({
  init : function(assetURLs, crossorigin)
  {
    PIXI.EventTarget.call(this);

    /**
     * The array of asset URLs that are going to be loaded
       *
     * @property assetURLs
     * @type Array<String>
     */
    this.assetURLs = assetURLs;

      /**
       * Whether the requests should be treated as cross origin
       *
       * @property crossorigin
       * @type Boolean
       */
    this.crossorigin = crossorigin;

      /**
       * Maps file extension to loader types
       *
       * @property loadersByType
       * @type Object
       */
      this.loadersByType = {
          "jpg":  GoldenGraphics.ImageLoader,
          "jpeg": GoldenGraphics.ImageLoader,
          "png":  GoldenGraphics.ImageLoader,
          "gif":  GoldenGraphics.ImageLoader
      };
  },

  /**
   * Starts loading the assets sequentially
   *
   * @method load
   */
  load: function()  {
      var scope = this;

    this.loadCount = this.assetURLs.length;

      for (var i=0; i < this.assetURLs.length; i++)
    {
      var fileName = this.assetURLs[i];
      var fileType = fileName.split(".").pop().toLowerCase();

          var loaderClass = this.loadersByType[fileType];
          if(!loaderClass)
              throw new Error(fileType + " is an unsupported file type");

          var loader = new loaderClass(fileName, this.crossorigin);

          loader.addEventListener("loaded", function()
          {
              scope.onAssetLoaded();
          });

          loader.addEventListener("error", function()
          {
              scope.onError();
          });

          loader.load();
    }
  },

  /**
   * Invoked after each file is loaded
   *
   * @method onAssetLoaded
   * @private
   */
  onAssetLoaded: function() {
      this.loadCount--;
    this.dispatchEvent({type: "onProgress", content: this});
    if(this.onProgress) this.onProgress();

    if(this.loadCount == 0)
    {
      this.dispatchEvent({type: "onComplete", content: this});
      if(this.onComplete) this.onComplete();
    }
  },

  /**
   * Invoked when there is an error loading one of the assets
   *
   * @method onError
   * @private
   */
  onError: function(){
    this.dispatchEvent({type: "onError", content: this});
  }
});



// RENDERING

  GoldenGraphics.CanvasRenderer = GoldenGraphics.Base.extend({
    init: function(){
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext("2d");
      this.imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
    },

    render: function(stage) {
      // clear canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      if(stage){
        this._updateImageData(stage);

        if(stage.imageData){
          this.context.putImageData(stage.imageData, 0, 0);
        }
      }
      else{
        console.log('Stage is not defined');
      }

    },

    resize : function(width, height){
      this.canvas.width = width;
      this.canvas.height = height;
    },

    _updateImageData: function(displayObject){
      var pos = 0;
      var renderData = null;
      var childImageData = null;
      var child = null;

      // TODO do not create new image data
      var renderData = null;

      var dataLength = 0;
      var matrixSize = 0;
      var r = 0;
      var g = 0;
      var b = 0;
      var a = 0;
      var a0 = 0;
      var af = 0;
      var x = 0;
      var y = 0;
      var pos_x = 0;
      var pos_y = 0;
      var renderDataWidth = 0;
      var renderDataHeight = 0;
      var childImageWidth = 0;
      var childImageHeight = 0;

      var _log = "";

      // only update render data for objects in the stage
      if(displayObject && displayObject.stage){
        if(!displayObject.cachedImageData){
          this._cacheImageData(displayObject);
        }

        // for each child
        for(var i in displayObject.children){
          if(displayObject.children.hasOwnProperty(i)){
            if(!renderData){
              renderData = displayObject.cachedImageData ? displayObject.cachedImageData : this.context.createImageData(this.canvas.width, this.canvas.height);
            }

            renderDataWidth = renderData.width;
            renderDataHeight = renderData.height;

            child = displayObject.children[i];


            if(child.texture && !child.cachedImageData){
              this._cacheImageData(child);
            }

            x = Math.round(child.position.x);
            y = Math.round(child.position.y);

            if(child.opacity > 0){

              // if object has children or a texture to render
              if(child.children.length > 0 || (renderData && child.imageData)){
                matrixSize = renderData.data.length - 1;

                this._updateImageData(child);
                childImageData = child.imageData;

                childImageWidth = childImageData.width;
                childImageHeight = childImageData.height;

                for(var j = 0; j < childImageWidth; j++){
                  for(var k = 0; k < childImageHeight; k++){
                    pos = (j * childImageWidth + k) * 4;
                    pos_x = k + x;
                    pos_y = j + y;

                    // only render pixels inside the screen, avoid mirror effect
                    if(pos_x >= 0 && pos_y >= 0 && pos_x < renderData.width && pos_y < renderData.height){
                      renderPos = (pos_y * renderData.width + pos_x) * 4;

                      // _log += renderPos + " ,";

                      r = childImageData.data[pos+0];
                      g = childImageData.data[pos+1];
                      b = childImageData.data[pos+2];
                      a0 = childImageData.data[pos+3];

                      a = a0 / 255 * child.opacity; //normaliza alpha between 0 and 1 and apply opacity

                      // check render for pixels with alpha > 0
                      if(a > 0 && renderPos < matrixSize){
                        af = renderData.data[renderPos+3] / 255 || 1;

                        renderData.data [renderPos+0] = r * a + (1 - a) * renderData.data [renderPos+0] * af;
                        renderData.data [renderPos+1] = g * a + (1 - a) * renderData.data [renderPos+1] * af;
                        renderData.data [renderPos+2] = b * a + (1 - a) * renderData.data [renderPos+2] * af;
                        renderData.data [renderPos+3] = Math.max(a0, renderData.data [renderPos+3]);
                        // var p1 = renderPos + 3;
                        // _log += p1 + " " + b + ",   ";
                      }
                    }
                  }
                }
              }
            }
          }
        }

        this._applyFilters(displayObject);

        if(_log && _log.length > 0 && console){
          console.log(_log);
        }

        displayObject.imageData = renderData || displayObject.imageData;
      }
    },

    _cacheImageData: function(displayObject){
      if(displayObject.texture){
        displayObject.cachedImageData = this.getImageData(displayObject.texture);
        displayObject.imageData = this.cloneImageData(displayObject.cachedImageData);
      }
    },

    _applyFilters : function(displayObject){
      if(displayObject.cachedImageData && displayObject.imageData){
        for(var i in displayObject.filters){
          if(displayObject.filters.hasOwnProperty(i)){
            displayObject.filters[i].apply(displayObject.cachedImageData, displayObject.imageData);
          }
        }
      }
    },

    getImageData: function(image){
      var imageData = null;
      var width = Math.min(image.width, this.canvas.width);
      var height = Math.min(image.height, this.canvas.height);

      // draw image in canvas to retrieve image data

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage (image, 0,   0);
      imageData = this.context.getImageData(0, 0, width, height);

      // clear canvas after caching image

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // restore previous render
      // this.render();

      return imageData;
    },

    cloneImageData: function(imageData){
      var clone = this.context.createImageData(imageData);
      var l = clone.data.length;

      for(var i = 0; i < l; i++){
        clone.data[i] = imageData.data[i];
      }

      return clone;
    }
  });

  // Static functions and properties
GoldenGraphics.BaseTexture = GoldenGraphics.Base.extend({
  init : function(){

  }
});

GoldenGraphics.BaseTexture.cache = {};
// DISPLAY OBJECT CONTAINER

  GoldenGraphics.DisplayObjectContainer = GoldenGraphics.Base.extend({
    init : function(){
      this.children = [];
      this.filters = [];
      this.imageData = null;
      this.position = new GoldenGraphics.Point2D();
      this.opacity = 1;
      this.parent = null;

    },

    addChild : function(child){
      this.addChildAt(child, this.children.length);
    },



    addChildAt : function(child, index){
      if(index > this.children.length){
        index = this.children.length;
      }

      if(this.children.indexOf(child) < 0){
        this.children.splice(index, 0, child);
        child.parent = this;
        this._addChildToStage(child);
      }

    },

    removeChild : function(child){
      if(this.children.indexOf(child) > -1){
        this.children.splice(this.children.indexOf(child), 1);
        this._removeChildFromStage(child);
        child.parent = null;

        // clear render
        // this.
      }
    },

    contains : function(child){
      return this.children.indexOf(child) > -1;
    },

    // private properties

    _addChildToStage: function(child){
      if(child.stage != this.stage){
        child.stage = this.stage;
        for(var i in child.children){
          if(child.children.hasOwnProperty(i)){
            this._addChildToStage(child.children[i]);
          }
        }
      }
    },

    _removeChildFromStage: function(child){
      child.stage = null;
      for(var i in child.children){
        if(child.children.hasOwnProperty(i)){
          this._removeChildFromstage(child.children[i]);
        }
      }
    },

    _updateImageData: function(){
      var pos = 0;
      var renderData = null;
      var childImageData = null;
      var child = null;

      // TODO do not create new image data
      var renderData = null;

      var dataLength = 0;
      var matrixSize = 0;
      var r = 0;
      var g = 0;
      var b = 0;
      var a = 0;
      var a0 = 0;
      var af = 0;
      var x = 0;
      var y = 0;
      var pos_x = 0;
      var pos_y = 0;

      var _log = "";

      // only update render data for objects in the stage
      if(this.stage){
        // for each child
        for(var i in this.children){
          if(this.children.hasOwnProperty(i)){
            renderData = renderData || this.cachedImageData ? this.cachedImageData : this.stage.renderer.context.createImageData(this.stage.renderer.canvas.width, this.stage.renderer.canvas.height);
            child = this.children[i];
            childImageData = child.imageData;

            x = Math.round(child.position.x);
            y = Math.round(child.position.y);

            if(child.opacity > 0 && childImageData){
              matrixSize = renderData.data.length - 1;

              child._updateImageData();

              for(var j = 0; j < childImageData.width; j++){
                for(var k = 0; k < childImageData.height; k++){
                  pos = (j * childImageData.width + k) * 4;
                  pos_x = k + x;
                  pos_y = j + y;

                  // only render pixels inside the screen, avoid mirror effect
                  if(pos_x >= 0 && pos_y >= 0 && pos_x < renderData.width && pos_y < renderData.height){
                    renderPos = (pos_y * renderData.width + pos_x) * 4;

                    // _log += renderPos + " ,";

                    r = childImageData.data[pos+0];
                    g = childImageData.data[pos+1];
                    b = childImageData.data[pos+2];
                    a0 = childImageData.data[pos+3];

                    a = a0 / 255 * child.opacity; //normaliza alpha between 0 and 1 and apply opacity

                    // check render for pixels with alpha > 0
                    if(a > 0 && renderPos < matrixSize){
                      af = renderData.data[renderPos+3] / 255 || 1;

                      renderData.data [renderPos+0] = r * a + (1 - a) * renderData.data [renderPos+0] * af;
                      // _log += renderPos + " " + renderData.data [renderPos] + ", ";
                      renderData.data [renderPos+1] = g * a + (1 - a) * renderData.data [renderPos+1] * af;
                      renderData.data [renderPos+2] = b * a + (1 - a) * renderData.data [renderPos+2] * af;
                      renderData.data [renderPos+3] = Math.max(a0 * a, renderData.data [renderPos+3]);
                    }
                  }
                }
              }
            }
          }
        }

        this.applyFilters();

        if(_log && _log.length > 0){
          console.log(_log);
        }

        this.imageData = renderData || this.imageData;
      }
    }
  })
  // STAGE
  GoldenGraphics.Stage = GoldenGraphics.DisplayObjectContainer.extend({
    init : function(){
      this._super();
      this.stage = this;
    }
  });
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

    apply: function(origin, target) {
      var pos = 0;
      var inpos = 0;

      var r = this.color.r;
      var g = this.color.g;
      var b = this.color.b;

      var _log = "";

      if(!this._prevColor || this._prevColor.r != this.color.r || this._prevColor.g != this.color.g || this._prevColor.b != this.color.b){
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

        if(this._prevColor){
          this._prevColor.r = this.color.r;
          this._prevColor.g = this.color.g;
          this._prevColor.b = this.color.b;
          this._prevColor.a = this.color.a;
        }
        else{
          this._prevColor = new GoldenGraphics.Color(this.color.r, this.color.g, this.color.b, this.color.a);
        }


      }

    }
  });

  exports.GoldenGraphics = GoldenGraphics;
})(window);