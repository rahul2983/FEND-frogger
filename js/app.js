var score = 0;
var lives = 5;
var modalBodyText = document.querySelector('.modal-body');
var modal = document.querySelector('.modal');

var getCoordinates = function() {
  return {
    x: Math.floor(this.x),
    y: this.y
  }
}

var checkCollision = function() {
  enemyXYPosition = new Array(3);
  playerXYPosition = getCoordinates.call(player);
  for (var i = 0; i <= enemyXYPosition.length - 1; i++) {
    enemyXYPosition[i] = getCoordinates.call(allEnemies[i]);
  }
  enemyXYPosition.forEach(position => {
    if (position.y === playerXYPosition.y) {
      if (Math.abs(position.x - playerXYPosition.x) < 50) {
        handleCollision.call(player);
        enemyXYPosition.length = 0;
      }
    }
  });
}

var captureGem = function() {
  gemXYPosition = getCoordinates.call(collectible);
  playerXYPosition = getCoordinates.call(player);
  if (gemXYPosition.x === playerXYPosition.x) {
    if (gemXYPosition.y === playerXYPosition.y)
    {
      handleGemCapture.call(collectible);
    }
  }
}

var handleCollision = function() {
  lives -= 1;
  this.reset();
}

var handleGemCapture = function() {
  if (this.sprite === 'images/Gem Blue.png') {
    score += 10;
  } else if (this.sprite === 'images/Gem Green.png') {
    score += 15;
  } else if (this.sprite === 'images/Gem Orange.png') {
    score += 20;
  } else if (this.sprite === 'images/Heart.png') {
    lives += 1;
  }
  this.reset();
}

// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.startingYCoordinates = [60, 60+83, 60+83+83];
  // this.speedSelection = [0.5, 1, 1.5];
  this.speedSelection = [0.75, 0.5, 0.25];
  this.selectXYCoordinates();
};

Enemy.prototype.selectXYCoordinates = function() {
  this.x = 0;
  this.speed = this.speedSelection[Math.floor(Math.random() * 3)];
  this.y = this.startingYCoordinates[Math.floor(Math.random() * 3)];
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  if (this.x < 505) {
    this.x = this.x + 505 * this.speed * dt;
  } else {
    this.x = 0;
  }
  // 3 Possible Y Coordinates -> 226, 143, 60
  if (Math.round(this.x) === 505) {
    this.selectXYCoordinates();
    this.update(dt);
  }

  checkCollision();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.font = "15px Arial";
  ctx.fillText("Lives: " + lives, 10, 40);
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  // 3 possible Y Coordinates in the enemy zone 226, 143, 60
  this.setCharacter = function(charText) {
    this.sprite = charText;
  }
  if (!this.sprite) {
    this.sprite = 'images/char-boy.png';
  }
  this.xCoordinates = [0, 100, 200, 300, 400];
  var randomSelector = Math.floor(Math.random() * 5);
  this.x = this.xCoordinates[randomSelector];
  this.y = 392;
}

Player.prototype.update = function() {
  if (this.y === (60-83)) {
    score += 10;
    this.reset();
  }
};

Player.prototype.render = function() {
  ctx.font = "15px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyString) {
  if (keyString === 'left' && this.x !== 0) {
    this.x = this.x - 100;
  } else if (keyString === 'right' && this.x !== 400) {
    this.x = this.x + 100;
  } else if (keyString === 'up' && this.y !== (60-83)) {
    this.y = this.y - 83;
  } else if (keyString === 'down' && this.y !== 392) {
    this.y = this.y + 83;
  }
}

Player.prototype.reset = function() {
  if (lives === 0) {
    var firstPTag = document.createElement('p');
    firstPTag.innerHTML = "Oops!! You lost all your lives.";

    var secondPTag = document.createElement('p');
    secondPTag.innerHTML = "Your Grand Score: " + score;

    modalBodyText.appendChild(firstPTag);
    modalBodyText.appendChild(secondPTag);

    $('#myModal').modal('show');

    this.sprite = 'images/char-boy.png';
    lives = 5;
    score = 0;
  }

  this.x = this.xCoordinates[Math.floor(Math.random() * 5)];
  this.y = 392;
}

var Collectible = function() {
  // 3 possible Y Coordinates in the enemy zone 226, 143, 60
  var possibleCollectible = [
    'images/Gem Blue.png',
    'images/Gem Green.png',
    'images/Gem Orange.png',
    'images/Heart.png'
  ];
  this.sprite = possibleCollectible[Math.round(Math.random() * 4)];

  if (!this.sprite) {
    this.sprite = 'images/Gem Blue.png';
  }

  this.xCoordinates = [0, 100, 200, 300, 400];
  this.x = this.xCoordinates[Math.floor(Math.random() * 5)];

  this.yCoordinates = [60, 143, 226];
  this.y = this.yCoordinates[Math.floor(Math.random() * 3)];
}

Collectible.prototype.update = function() {
  captureGem();
}

Collectible.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Collectible.prototype.reset = function() {
  var possibleCollectible = [
    'images/Gem Blue.png',
    'images/Gem Green.png',
    'images/Gem Orange.png',
    'images/Heart.png'
  ];
  this.sprite = possibleCollectible[Math.round(Math.random() * 4)];
  if (!this.sprite) {
    this.sprite = 'images/Gem Blue.png';
  }

  this.xCoordinates = [0, 100, 200, 300, 400];
  this.x = this.xCoordinates[Math.floor(Math.random() * 5)];

  this.yCoordinates = [60, 143, 226];
  this.y = this.yCoordinates[Math.floor(Math.random() * 3)];
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < 3; i++) {
  allEnemies[i] = new Enemy();
}
// Place the player object in a variable called player
var player = new Player();

// Place the Collectible in a variable called collectible
var collectible = new Collectible();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  if (!modal.getAttribute('class').includes("show")) {
    player.handleInput(allowedKeys[e.keyCode]);
  }
});

var charImages = document.getElementById("char-images");
charImages.addEventListener("click", function(event) {
  player.setCharacter(event.target.getAttribute("src"));
});

// Attaching event listener to Play Again Button
let playAgain = document.querySelector('.btn-primary');
playAgain.addEventListener('click', function(event) {
  while (modalBodyText.firstChild) {
    modalBodyText.removeChild(modalBodyText.firstChild);
  };
});

// Attaching event listener to Close icon on the modal
let modalClose = document.querySelector('.close');
modalClose.addEventListener('click', function(event) {
  while (modalBodyText.firstChild) {
    modalBodyText.removeChild(modalBodyText.firstChild);
  }
})