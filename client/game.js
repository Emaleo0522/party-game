const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const socket = io("https://outstanding-eran-1nosequeponer2-f2fdb7e9.koyeb.app");

let players = {};
let myId = null;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false
};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function drawPlayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const id in players) {
    const p = players[id];

    // Cuadro del jugador
    ctx.fillStyle = id === myId ? "lime" : "orange";
    ctx.fillRect(p.x, p.y, 40, 40);

    // Emoji encima del cuadrado
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(p.emoji || "❓", p.x + 20, p.y - 30);

    // Nombre flotante
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(p.name || "?", p.x + 20, p.y - 10);
  }
}

function gameLoop() {
  socket.emit("move", keys);
  drawPlayers();
  requestAnimationFrame(gameLoop);
}

socket.on("init", id => myId = id);
socket.on("state", updatedPlayers => players = updatedPlayers);

gameLoop();

