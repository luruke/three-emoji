if (!THREE) {
  console.log('argh...');
}

THREE.Emoji = function(emoji) {
  this.emoji = emoji;
  this.createCanvas();
  this.bw();

  this.geometry = new THREE.PlaneGeometry(4, 3, 1, 1);
  this.material = new THREE.MeshPhongMaterial({
    map: this.getTexture(this.canvas),
    bumpMap: this.getTexture(this.canvasBw),
    bumpScale: 2,
    side: THREE.DoubleSide
  });

  var sqLength = 4;
  var squareShape = new THREE.Shape();
  squareShape.moveTo( 0,0 );
  squareShape.lineTo( 0, sqLength );
  squareShape.lineTo( sqLength, sqLength );
  squareShape.lineTo( sqLength, 0 );
  squareShape.lineTo( 0, 0 );

  var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
  var geometry = new THREE.ExtrudeGeometry(squareShape, extrudeSettings);

  return new THREE.Mesh(geometry, this.material);
};

THREE.Emoji.prototype.createCanvas = function() {
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.ctx.font = '100px Arial';
  this.ctx.textBaseline = 'top';
  this.ctx.fillText(this.emoji, 0, 0);
};

THREE.Emoji.prototype.bw = function() {
  this.canvasBw = document.createElement('canvas');
  this.bwCtx = this.canvasBw.getContext('2d');

  var imgd = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  var pix = imgd.data;

  for (var i = 0, n = pix.length; i < n; i += 4) {
    var grayscale = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
    pix[i  ] = grayscale;   // red
    pix[i+1] = grayscale;   // green
    pix[i+2] = grayscale;   // blue
    // alpha
  }

  this.bwCtx.putImageData(imgd, 0, 0);
};

THREE.Emoji.prototype.getTexture = function(canvas) {
  var texture = new THREE.Texture(canvas);

  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 1 );

  return texture;
};
