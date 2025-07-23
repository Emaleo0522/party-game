import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

let players = {};
const emojis = ["😺", "🐶", "🐸", "🐵", "👻", "🤖", "🍕", "💩", "😎", "🐷"];

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
  io.emit("state", players);

  socket.on("move", keys => {
    const p = players[socket.id];
    if (!p) return;

    const speed = 3;
    if (keys.ArrowUp || keys.w) p.y -= speed;
    if (keys.ArrowDown || keys.s) p.y += speed;
    if (keys.ArrowLeft || keys.a) p.x -= speed;
    if (keys.ArrowRight || keys.d) p.x += speed;

    io.emit("state", players);
  });

  socket.on("disconnect", () => {
    console.log(`Jugador desconectado: ${socket.id}`);
    delete players[socket.id];
    io.emit("state", players);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});

