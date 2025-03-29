const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resumeButton = document.getElementById('resumeButton');
const startScreen = document.getElementById('startScreen');
const pauseOverlay = document.getElementById('pauseOverlay');

const box = 20; // Size of each grid unit
const canvasSize = 400;

let score = 0;
let snake = [];
let food = {};
let d; // direction
let game; // game interval
let isPaused = false;
let gameStarted = false;

function initGame() {
  // Initial snake position
  snake = [];
  snake[0] = { x: 9 * box, y: 10 * box };

  // Initial food position
  placeFood();

  // Initial direction
  d = undefined; // Reset direction

  // Reset score
  score = 0;
  scoreElement.innerText = score;

  // Reset state
  isPaused = false;
  gameStarted = true;

  // Update UI
  startScreen.classList.add('hidden');
  pauseOverlay.classList.add('hidden');
  pauseButton.disabled = false;
  pauseButton.innerText = 'Pause';

  // Clear any existing interval
  if (game) {
    clearInterval(game);
  }
  // Start game loop
  game = setInterval(draw, 150); // Speed set to 150ms
}

function placeFood() {
   food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
  };
  // Ensure food doesn't spawn on the snake
  for (let i = 0; i < snake.length; i++) {
    if (food.x === snake[i].x && food.y === snake[i].y) {
      placeFood(); // Recursively try again
      break;
    }
  }
}


document.addEventListener("keydown", directionControl);

function directionControl(event) {
  // Allow direction change only if game started and not paused
  if (!gameStarted || isPaused) return;

  let key = event.keyCode;
  if (key == 37 && d != "RIGHT") { // Left arrow
    d = "LEFT";
  } else if (key == 38 && d != "DOWN") { // Up arrow
    d = "UP";
  } else if (key == 39 && d != "LEFT") { // Right arrow
    d = "RIGHT";
  } else if (key == 40 && d != "UP") { // Down arrow
    d = "DOWN";
  }
}

// Check collision function
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

function gameOver() {
    clearInterval(game);
    gameStarted = false;
    pauseButton.disabled = true;
    startScreen.classList.remove('hidden'); // Show start screen again
    startButton.innerText = 'Play Again?'; // Change button text
    alert('Game Over! Score: ' + score);
}


// Draw everything to the canvas
function draw() {
  if (isPaused) return; // Don't draw if paused

  // Clear canvas
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i == 0) ? "green" : "lightgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "darkgreen";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
  ctx.strokeStyle = "darkred";
  ctx.strokeRect(food.x, food.y, box, box);

  // Old head position
  // Ensure snake has a head before accessing it
  if (snake.length === 0) {
      console.error("Snake array is empty!");
      gameOver(); // Treat as game over if snake disappears
      return;
  }
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Which direction - only move if a direction is set
  if (d) {
      if (d == "LEFT") snakeX -= box;
      if (d == "UP") snakeY -= box;
      if (d == "RIGHT") snakeX += box;
      if (d == "DOWN") snakeY += box;
  } else {
      // If no direction is set yet (start of game), don't move
      // but still draw the initial state
      return; // Skip the rest of the movement logic until a key is pressed
  }


  // If the snake eats the food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    scoreElement.innerText = score;
    placeFood();
    // Don't remove tail - snake grows
  } else {
    // Remove the tail if snake has moved
     if (snake.length > 0) {
        snake.pop();
    }
  }

  // New head
  let newHead = {
    x: snakeX,
    y: snakeY
  };

  // Game over conditions
  if (snakeX < 0 || snakeX >= canvasSize || snakeY < 0 || snakeY >= canvasSize || collision(newHead, snake)) {
    gameOver();
    return; // Stop the draw function execution
  }

  snake.unshift(newHead);
}

function togglePause() {
    if (!gameStarted) return; // Can't pause if game hasn't started

    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(game); // Stop the game loop
        pauseOverlay.classList.remove('hidden'); // Show pause menu
        pauseButton.innerText = 'Resume'; // Change button text for clarity (optional)
    } else {
        pauseOverlay.classList.add('hidden'); // Hide pause menu
        game = setInterval(draw, 150); // Resume game loop
        pauseButton.innerText = 'Pause'; // Change button text back
    }
}

// Event Listeners
startButton.addEventListener('click', initGame);
pauseButton.addEventListener('click', togglePause);
resumeButton.addEventListener('click', togglePause); // Resume button also toggles pause state

// Initial drawing of the board elements before game starts
function drawInitialState() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    // Optionally draw grid lines or other static elements
}

drawInitialState(); // Draw the empty board initially
