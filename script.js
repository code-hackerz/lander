const startBtn = document.getElementById("startBtn");
const statusDiv = document.getElementById("status");
const canvas = document.getElementById("game-area");
const ctx = canvas.getContext("2d");

// Set the canvas size to 400x400
canvas.width = 400;
canvas.height = 400;

const gravity = 0.01;
const sideEngineThrust = 0.01;
const mainEngineThrust = 0.03;

const ship = {
  color: "black",
  // height, width
  w: 8,
  h: 22,
  // position
  x: 0,
  y: 0,
  // velocity
  dx: 0,
  dy: 0,
  mainEngine: false,
  leftEngine: false,
  rightEngine: false,
  crashed: false,
  landed: false,
};

function initShip() {
  // position
  ship.x = 150 + Math.random() * 100;
  ship.y = 150 + Math.random() * 100;
  // velocity
  ship.dx = Math.random();
  ship.dy = Math.random();
  ship.mainEngine = false;
  ship.leftEngine = false;
  ship.rightEngine = false;
  ship.crashed = false;
  ship.landed = false;
}

function drawTriangle(a, b, c, fill) {
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.lineTo(c[0], c[1]);
  ctx.lineTo(a[0], a[1]);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawShip() {
  ctx.save();
  ctx.beginPath();
  ctx.translate(ship.x, ship.y);
  ctx.rect(ship.w * -0.5, ship.h * -0.5, ship.w, ship.h);
  ctx.fillStyle = ship.color;
  ctx.fill();
  ctx.closePath();

  // Draw the flame if engine is on
  if (ship.mainEngine) {
    drawTriangle(
      [ship.w * -0.5, ship.h * 0.5],
      [ship.w * 0.5, ship.h * 0.5],
      [0, ship.h * 0.5 + Math.random() * 10],
      "orange"
    );
  }
  if (ship.rightEngine) {
    drawTriangle(
      [ship.w * 0.5, ship.h * -0.25],
      [ship.w * 0.5 + Math.random() * 10, 0],
      [ship.w * 0.5, ship.h * 0.25],
      "orange"
    );
  }
  if (ship.leftEngine) {
    drawTriangle(
      [ship.w * -0.5, ship.h * -0.25],
      [ship.w * -0.5 - Math.random() * 10, 0],
      [ship.w * -0.5, ship.h * 0.25],
      "orange"
    );
  }
  ctx.restore();
}

function updateShip() {
  // what forces acting on the ship?
  if (ship.rightEngine) {
    ship.dx -= sideEngineThrust;
  }
  if (ship.leftEngine) {
    ship.dx += sideEngineThrust;
  }
  if (ship.mainEngine) {
    ship.dy -= mainEngineThrust;
  }

  // gravity is always acting on the ship
  ship.dy += gravity;

  // after calculating velocity, update our position
  ship.x += ship.dx;
  ship.y += ship.dy;
}

function checkCollision() {
  const top = ship.y - ship.h / 2;
  const bottom = ship.y + ship.h / 2;
  const left = ship.x - ship.w / 2;
  const right = ship.x + ship.w / 2;
  if (left < 0 || right > canvas.width || top < 0 || bottom > canvas.height) {
    ship.crashed = true;
    return;
  }
  if (
    ship.dy < 0.2 &&
    ship.dx < 0.2 &&
    bottom > canvas.height - 5 &&
    bottom < canvas.height
  ) {
    ship.landed = true;
    return;
  }
}

function gameLoop() {
  updateShip();

  checkCollision();
  if (ship.crashed) {
    statusDiv.innerHTML = "GAME OVER - crashed";
    endGame();
  } else if (ship.landed) {
    statusDiv.innerHTML = "LANDED - you win!";
    endGame();
  } else {
    // Clear entire screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShip();
    requestAnimationFrame(gameLoop);
  }
}

function keyLetGo(event) {
  switch (event.keyCode) {
    case 37: // Left Arrow key
      ship.leftEngine = false;
      break;
    case 39: // Right Arrow key
      ship.rightEngine = false;
      break;
    case 40: // Down Arrow key
      ship.mainEngine = false;
      break;
    default:
      return;
  }
  // don't let arrow keys move screen around
  event.preventDefault();
}

function keyPressed(event) {
  switch (event.keyCode) {
    case 37: // Left Arrow key
      ship.leftEngine = true;
      break;
    case 39: // Right Arrow key
      ship.rightEngine = true;
      break;
    case 40: // Down Arrow key
      ship.mainEngine = true;
      break;
    default:
      return;
  }
  // don't let arrow keys move screen around
  event.preventDefault();
}

function start() {
  // console.log("start", ship);
  startBtn.disabled = true;
  statusDiv.innerHTML = "";
  initShip();

  document.addEventListener("keyup", keyLetGo);
  document.addEventListener("keydown", keyPressed);
  requestAnimationFrame(gameLoop);
}

function endGame() {
  // console.log("endGame", ship);
  startBtn.disabled = false;
  document.removeEventListener("keyup", keyLetGo);
  document.removeEventListener("keydown", keyPressed);
}
