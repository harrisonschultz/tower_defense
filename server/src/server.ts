import express = require("express");
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { players } from "./globals";
import { Player } from "./player";

const app = express();
const server = createServer(app);

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/../public/index.html");
});

const io = new Server(server);

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
  players[socket.id] = new Player();

  // send the players object to the new player
  socket.emit("currentPlayers", players);

  // update all other players of the new player
  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.onAny((msg, data) => {
    socket.broadcast.emit(msg, data);
  })

  socket.on("disconnect", function () {
    console.log("user disconnected");
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });
});

server.listen(process.env.PORT || 8081, function () {
  console.log(`Listening on ${(server.address() as any).port}`);
});
