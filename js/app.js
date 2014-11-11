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

  clear: function() {
    context.fillStyle = "#046380";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

}

window.Coin = {

  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  width: 30,
  height: 30,

  draw: function() {
    context.fillStyle = "#2F2F2F";
    context.fillRect(this.x, this.y, this.width, this.height);
  },

  hasBeenHit: function(x, y) {
    return ((x >= this.x && x <= this.x + this.width) || (x + Player.width >= this.x && x + Player.width <= this.x + this.width))
      && ((y >= this.y && y <= this.y + this.height) || (y + Player.height >= this.y && y + Player.height <= this.y + this.height));
  },

  regenerateCoordinates: function() {
    this.x = Math.floor((Math.random() * (window.innerWidth - 30)) + 1);
    this.y = Math.floor((Math.random() * (window.innerHeight -30)) + 1);
  }

}

window.Wall = function(x, y, width, height) {

  this.x = x;
  this.y = y;
  this.width = (window.innerWidth / 100) * 5;
  this.height = height;

  this.draw = function() {
    context.fillStyle = "#F16D4A";
    context.fillRect(this.x, this.y, this.width, this.height);
  },

  this.hasBeenHit = function(x, y) {
    return ((x >= this.x && x <= this.x + this.width) || (x + Player.width >= this.x && x + Player.width <= this.x + this.width))
      && ((y >= this.y && y <= this.y + this.height) || (y + Player.height >= this.y && y + Player.height <= this.y + this.height));
  }

}

window.Player = {

  x: 0,
  y: 0,
  width: 30,
  height: 30,

  draw: function() {
    if (this.x + this.width >= window.innerWidth) { this.x = window.innerWidth - this.width; }
    if (this.x <= 0) { this.x = 0; }
    if (this.y + this.height >= window.innerHeight) { this.y = window.innerHeight - this.height; }
    if (this.y <= 0) { this.y = 0; }
    context.fillStyle = "#EFECCA";
    context.fillRect(this.x, this.y, this.width, this.height);
  },

  reset: function() {
    this.x = 0;
    this.y = 0;
  }

}

window.ondevicemotion = function(event) {
  Player.x += (Labyrinth.sensitivity * event.accelerationIncludingGravity.x * gyroscopeDirection);
  Player.y -= (Labyrinth.sensitivity * event.accelerationIncludingGravity.y * gyroscopeDirection);
}

document.getElementById("reverse-gyroscope").onclick = function () {
  gyroscopeDirection *= -1;
}

window.Maze = {

  walls: [],
  wallThickness: 50,
  currentX: 80,
  currentY: 0,

  create: function() {
    while(this.currentX <= window.innerWidth - 80) {
      this.walls.push(new Wall(this.currentX, this.currentY, this.wallThickness, window.innerHeight - 100));
      this.currentX += 100;
      if(this.currentY === 0) { this.currentY = 100; }
      else { this.currentY = 0; }
    }
  },

  draw: function() {
    for(var i=0; i < this.walls.length; i++) {
      this.walls[i].draw();
    }
  }

}

var gyroscopeDirection = 1;
var score = 0;
var canvas = Canvas.canvas;
var context = Labyrinth.getContext(canvas);
Labyrinth.setUp(canvas);
var walls = [];

function run() {
  Canvas.clear();
  Coin.draw();
  Maze.draw();
  Player.draw();
  if(Coin.hasBeenHit(Player.x, Player.y)) {
    Coin.regenerateCoordinates();
    score++;
    document.getElementById("score").innerHTML = "<strong>Score:</strong> " + score;
  }
  for(var i=0; i < Maze.walls.length; i++) {
    currentWall = Maze.walls[i];
    if(currentWall.hasBeenHit(Player.x, Player.y)) {
      Player.reset();
      console.log("Game Over! - You scored " + score + " points!");
      score = 0;
      document.getElementById("score").innerHTML = "<strong>Score:</strong> " + score;
      break;
    }
  }
  window.requestAnimationFrame(run);
};

Maze.create();
run();
