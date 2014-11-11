window.Labyrinth = {

  sensitivity: 5,

  getContext: function(canvas) {
    return canvas.getContext("2d");
  },

  setUp: function(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

}

window.Canvas = {

  canvas: document.getElementById("labyrinth"),

  width: window.innerWidth,
  height: window.innerHeight,

  clear: function(context) {
    context.fillStyle = "#046380";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

}

window.Coin = {

  x: window.innerWidth / 2,
  y: window.innerHeight / 2,

  draw: function(context) {
    context.fillStyle = "#2F2F2F";
    context.fillRect(this.x, this.y, 30, 30);
  },

  hasBeenHit: function(x, y) {
    return (x >= this.x && x <= this.x + 30) && (y >= this.y && y <= this.y + 30)
  },

  regenerateCoordinates: function() {
    this.x = Math.floor((Math.random() * (window.innerWidth - 30)) + 1);
    this.y = Math.floor((Math.random() * (window.innerHeight -30)) + 1);
  }
}

window.Ball = {

  x: 50,
  y: 50,

  draw: function(context) {
    if (this.x + 30 >= window.innerWidth) { this.x = window.innerWidth - 10; }
    if (this.x <= 10) { this.x = 10; }
    if (this.y + 30 >= window.innerHeight) { this.y = window.innerHeight - 10; }
    if (this.y <= 10) { this.y = 10; }
    context.beginPath();
    context.arc(this.x, this.y, 10, 0, Math.PI * 2);
    context.closePath();
    context.fillStyle = "#EFECCA";
    context.fill();
  }

}

window.ondevicemotion = function(event) {
  Ball.x += (Labyrinth.sensitivity * event.accelerationIncludingGravity.x);
  Ball.y -= (Labyrinth.sensitivity * event.accelerationIncludingGravity.y);
}

var canvas = Canvas.canvas;
var context = Labyrinth.getContext(canvas);
Labyrinth.setUp(canvas);

function run() {
  Canvas.clear(context);
  Coin.draw(context);
  Ball.draw(context);
  if(Coin.hasBeenHit(Ball.x, Ball.y)) {
    Coin.regenerateCoordinates();
  }
  window.requestAnimationFrame(run);
};

run();
