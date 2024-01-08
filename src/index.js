const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));
let count = 0;
io.on("connection", (socket) => {
  console.log("New connnectio");
  socket.emit("countUpdated", count);

  socket.broadcast.emit("newUser", "new user connected joined");

  socket.on("increment", () => {
    count++;
    // socket.emit("countUpdated", count);

    io.emit("countUpdated", count);
  });

  socket.on("message", (message) => {
    console.log(message);
    io.emit("messageReceived", message);
  });

  socket.on("disconnect", () => {
    io.emit("messageReceived", "A user has left");
  });
});
server.listen(port, () => console.log("listening on port " + port));
