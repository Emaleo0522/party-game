const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const socket = io("https://outstanding-eran-1nosequeponer2-f2fdb7e9.koyeb.app"); // <- Cambiar luego

let players = {};
let myId = null;

// Movimiento del jugador
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false };

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function drawPlayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const id in players) {
    const p = players[id];
    ctx.fillStyle = id === myId ? "lime" : "orange";
    ctx.fillRect(p.x, p.y, 40, 40);
  }
}

function gameLoop() {
  socket.emit("move", keys);
  drawPlayers();
  requestAnimationFrame(gameLoop);
}

// Conexión con el servidor
socket.on("init", id => myId = id);
socket.on("state", updatedPlayers => players = updatedPlayers);

gameLoop();

