  // STAGE
  GoldenGraphics.Stage = GoldenGraphics.DisplayObjectContainer.extend({
    init : function(){
      this._super();
      this.stage = this;
    }
  });