window.Labyrinth = {

  sensitivity: 5,
  gyroscopeDirection: 1,
  score: 0,
  stopped: true,

  canvas: function() {
    return Canvas.canvas;
  },

  context: function() {
    return this.getContext(this.canvas());
  },

  getContext: function() {
    return this.canvas().getContext("2d");
  },

  setUp: function() {
    this.canvas().width = window.innerWidth;
    this.canvas().height = window.innerHeight;
    Canvas.draw();
    Maze.create();
  },

  updateScore: function() {
    document.getElementById("score").innerHTML = "<strong>" + Player.name + "'s Score:</strong> " + Labyrinth.score;
  },

  run: function() {
    this.stopped = false;
    Canvas.clear();
    Coin.draw();
    Maze.draw();
    Player.draw();
    if(Coin.hasBeenHit(Player.x, Player.y)) {
      Coin.regenerateCoordinates();
      Labyrinth.score++;
      this.updateScore();
    }
    for(var i=0; i < Maze.walls.length; i++) {
      currentWall = Maze.walls[i];
      if(currentWall.hasBeenHit(Player.x, Player.y)) {
        Player.reset();
        document.getElementById("game-over-message").innerHTML = "You scored " + this.score + " points!";
        document.getElementById("game-over").style.display = "block";
        this.score = 0;
        this.stop();
        break;
      }
    }
    if(!this.stopped) {
      this.animationID = window.requestAnimationFrame(Labyrinth.run.bind(Labyrinth));
    }
  },

  stop: function() {
    window.cancelAnimationFrame(this.animationID);
    this.stopped = true;
  }

}

window.Canvas = {

  canvas: document.getElementById("labyrinth"),

  width: window.innerWidth,
  height: window.innerHeight,

  draw: function() {
    Labyrinth.context().fillStyle = "#046380";
    Labyrinth.context().fillRect(0, 0, window.innerWidth, window.innerHeight);
  },

  clear: function() {
    this.draw();
  }

}

window.Coin = {

  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  width: 30,
  height: 30,

  draw: function() {
    Labyrinth.context().fillStyle = "#2F2F2F";
    Labyrinth.context().fillRect(this.x, this.y, this.width, this.height);
  },

  hasBeenHit: function(x, y) {
    return ((x >= this.x && x <= this.x + this.width) || (x + Player.width >= this.x && x + Player.width <= this.x + this.width))
      && ((y >= this.y && y <= this.y + this.height) || (y + Player.height >= this.y && y + Player.height <= this.y + this.height));
  },

  regenerateCoordinates: function() {
    var newX = Math.floor((Math.random() * (window.innerWidth - 30)) + 1);
    var newY = Math.floor((Math.random() * (window.innerHeight - 30)) + 1);
    for(var i=0; i < Maze.walls.length; i++) {
      currentWall = Maze.walls[i];
      if(currentWall.hasBeenHit(newX, newY)) {
        this.regenerateCoordinates();
      }
    }
    this.x = newX;
    this.Y = newY;
  }

}

window.Wall = function(x, y, width, height) {

  this.x = x;
  this.y = y;
  this.height = height;
  this.maxWidth = 30;
  this.width = function() {
    if ((window.innerWidth / 100) * 5 >= this.maxWidth) {
      return this.maxWidth;
    } else {
      return (window.innerWidth / 100) * 5;
    }
  },

  this.draw = function() {
    Labyrinth.context().fillStyle = "#F16D4A";
    this.width();
    Labyrinth.context().fillRect(this.x, this.y, this.width(), this.height);
  },

  this.hasBeenHit = function(x, y) {
    return ((x >= this.x && x <= this.x + this.width()) || (x + Player.width >= this.x && x + Player.width <= this.x + this.width()))
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
    Labyrinth.context().fillStyle = "#EFECCA";
    Labyrinth.context().fillRect(this.x, this.y, this.width, this.height);
  },

  reset: function() {
    this.x = 0;
    this.y = 0;
  }

}

window.ondevicemotion = function(event) {
  if(!Labyrinth.stopped) {
    Player.x += (Labyrinth.sensitivity * event.accelerationIncludingGravity.x * Labyrinth.gyroscopeDirection);
    Player.y -= (Labyrinth.sensitivity * event.accelerationIncludingGravity.y * Labyrinth.gyroscopeDirection);
  }
}

document.getElementById("reverse-gyroscope").onclick = function () {
  Labyrinth.gyroscopeDirection *= -1;
}

window.Maze = {

  walls: [],
  wallThickness: 50,
  currentX: (window.innerWidth / 100) * 15,
  currentY: 0,

  create: function() {
    while(this.currentX <= window.innerWidth - 80) {
      this.walls.push(new Wall(this.currentX, this.currentY, this.wallThickness, window.innerHeight - 100));
      this.currentX += ((window.innerWidth / 100) * 15) + this.wallThickness;
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

document.getElementById("start").onclick = function() {
  Player.name = document.getElementById("player-name").value;
  Labyrinth.updateScore();
  document.getElementById("player-details").style.display = "none";
  Labyrinth.run();
}

Labyrinth.setUp();
