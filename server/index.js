import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

let players = {};
const emojis = ["😺", "🐶", "🐸", "🐵", "👻", "🤖", "🍕", "💩", "😎", "🐷"];

// Objetos del mapa
const mapObjects = [
  { x: 200, y: 150, emoji: "🍌", effect: "slip" },
  { x: 400, y: 300, emoji: "💣", effect: "explode" },
  { x: 600, y: 100, emoji: "⚽", effect: "bounce" }
];

// Función simple de colisión entre jugador y objeto
function checkCollision(p, obj) {
  const dx = p.x + 20 - obj.x;
  const dy = p.y + 20 - obj.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < 40;
}

io.on("connection", socket => {
  console.log(`Jugador conectado: ${socket.id}`);

  const randomName = "Jugador-" + Math.floor(Math.random() * 1000);
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  players[socket.id] = {
    x: 100 + Math.random() * 600,
    y: 100 + Math.random() * 400,
    name: randomName,
    emoji: randomEmoji
  };

  socket.emit("init", socket.id);
  io.emit("state", { players, mapObjects });

  socket.on("move", keys => {
    const p = players[socket.id];
    if (!p) return;

    const speed = 3;
    if (keys.ArrowUp || keys.w) p.y -= speed;
    if (keys.ArrowDown || keys.s) p.y += speed;
    if (keys.ArrowLeft || keys.a) p.x -= speed;
    if (keys.ArrowRight || keys.d) p.x += speed;

    // Aplicar efectos si colisiona con algún objeto
    for (const obj of mapObjects) {
      if (checkCollision(p, obj)) {
        if (obj.effect === "slip") {
          p.x += (Math.random() - 0.5) * 40;
          p.y += (Math.random() - 0.5) * 40;
        }
        if (obj.effect === "bounce") {
          p.x -= (keys.ArrowRight || keys.d) ? 40 : 0;
          p.x += (keys.ArrowLeft || keys.a) ? 40 : 0;
          p.y -= (keys.ArrowDown || keys.s) ? 40 : 0;
          p.y += (keys.ArrowUp || keys.w) ? 40 : 0;
        }
        if (obj.effect === "explode") {
          p.x += (Math.random() - 0.5) * 200;
          p

