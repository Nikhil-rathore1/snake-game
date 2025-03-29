const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const box = 20; // Size of each grid unit
const canvasSize = 400;
let score = 0;

// Initial snake position
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// Initial food position
let food = {
  x: Math.floor(Math.random() * (canvasSize / box)) * box,
  y: Math.floor(Math.random() * (canvasSize / box)) * box
};

// Initial direction
let d;

document.addEventListener("keydown", direction);

function direction(event) {
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

// Draw everything to the canvas
function draw() {
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
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Which direction
  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  // If the snake eats the food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    scoreElement.innerText = score;
    food = {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
    // Don't remove tail
  } else {
    // Remove the tail
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
    clearInterval(game);
    alert('Game Over! Score: ' + score + '\nRefresh to play again.');
    return; // Stop the draw function execution
  }

  snake.unshift(newHead);
}

// Call draw function every 150 ms (slower speed)
let game = setInterval(draw, 150);
