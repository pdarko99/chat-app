const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const Filter = require("bad-words");

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

const { generateMessage, generateLocation } = require("./utils/messages");

const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));
let count = 0;
io.on("connection", (socket) => {
  console.log("New connnectio");
  socket.emit("countUpdated", count);

  // socket.emit("messageReceived", generateMessage("Welcome!"));

  // socket.broadcast.emit(
  //   "newUser",
  //   generateMessage("new user connected joined")
  // );

  socket.on("increment", () => {
    count++;
    // socket.emit("countUpdated", count);

    io.emit("countUpdated", count);
  });

  socket.on("join", ({ username, room }) => {
    socket.join(room);
    socket.emit("messageReceived", generateMessage("Welcome!"));

    socket.broadcast
      .to(room)
      .emit("messageReceived", generateMessage(`${username} has joined!`));
  });

  socket.on("message", (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }
    io.to("Smooth").emit("messageReceived", generateMessage(message));
    callback();
  });

  socket.on("sendLocation", (message) => {
    console.log(message, "from message");
    // io.emit(
    //   "messageReceived",
    //   `https://google.com/maps?q=${message.lat},${message.long}`
    // );

    io.emit(
      "locationMessage",
      generateLocation(
        `https://google.com/maps?q=${message.lat},${message.long}`
      )
    );
  });

  socket.on("disconnect", () => {
    io.emit("messageReceived", generateMessage("A user has left"));
  });
});
server.listen(port, () => console.log("listening on port " + port));
