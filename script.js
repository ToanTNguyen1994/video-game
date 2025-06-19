const BOARD_SIZE = 5;
let board = [];
let treasures = [];
let traps = [];

let player = {
  x: 0,
  y: 0,
  health: 3,
  score: 0
};

document.addEventListener("DOMContentLoaded", () => {
  initBoard();
});

// Initialize board and place elements
function initBoard() {
  board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(" "));
  treasures = [];
  traps = [];
  player.x = 0;
  player.y = 0;
  player.health = 3;
  player.score = 0;

  placeObjects(treasures, "T");
  placeObjects(traps, "X");

  updatePlayerPosition();
  renderBoard();
}

// Place treasures and traps
function placeObjects(array, symbol) {
  let count = 0;
  while (count < 3) {
    let x = getRandomInt(0, BOARD_SIZE);
    let y = getRandomInt(0, BOARD_SIZE);
    if (board[y][x] === " " && !(x === 0 && y === 0)) {
      board[y][x] = symbol;
      array.push({ x, y });
      count++;
    }
  }
}

// Update board with player location
function updatePlayerPosition() {
  board[player.y][player.x] = "P";
}

// Movement handler
function movePlayer(direction) {
  board[player.y][player.x] = " ";

  switch (direction) {
    case "up":
      if (player.y > 0) player.y--;
      break;
    case "down":
      if (player.y < BOARD_SIZE - 1) player.y++;
      break;
    case "left":
      if (player.x > 0) player.x--;
      break;
    case "right":
      if (player.x < BOARD_SIZE - 1) player.x++;
      break;
  }

  checkTile();
  updatePlayerPosition();
  renderBoard();
}

// Check what's on the tile player moved to
function checkTile() {
  let tile = board[player.y][player.x];
  if (tile === "T") {
    player.score++;
    removeFromArray(treasures, player.x, player.y);
  } else if (tile === "X") {
    player.health--;
    removeFromArray(traps, player.x, player.y);
  }
  checkGameState();
}

// Render the game board
function renderBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  board.forEach(row => {
    const rowDiv = document.createElement("div");
    row.forEach(cell => {
      const cellDiv = document.createElement("span");
      cellDiv.classList.add("cell");
      cellDiv.textContent = cell;
      rowDiv.appendChild(cellDiv);
    });
    boardDiv.appendChild(rowDiv);
  });

  updateStats();
}

// Update the health and score display
function updateStats() {
  const stats = document.getElementById("stats");
  stats.innerHTML = `Health: ${player.health} | Score: ${player.score}`;
}

// Remove object from board array after collected/triggered
function removeFromArray(arr, x, y) {
  const index = arr.findIndex(obj => obj.x === x && obj.y === y);
  if (index !== -1) {
    arr.splice(index, 1);
  }
}

// Check win or lose conditions
function checkGameState() {
  if (player.score === 3) {
    setTimeout(() => {
      alert("🎉 You win! All treasures collected!");
      initBoard();
    }, 100);
  } else if (player.health <= 0) {
    setTimeout(() => {
      alert("💀 You lost! You ran out of health.");
      initBoard();
    }, 100);
  }
}

// Random number generator
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
