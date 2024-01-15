const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const app = express();
const Filter = require("bad-words");

const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000;

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRooms,
} = require("./utils/user");

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

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }
    socket.join(user.room);
    socket.emit("messageReceived", generateMessage("Welcome!"));

    socket.broadcast
      .to(user.room)
      .emit("messageReceived", generateMessage(`${user.username} has joined!`));

    callback();
  });

  socket.on("message", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }
    io.to(user.room).emit("messageReceived", generateMessage(message));
    callback();
  });

  socket.on("sendLocation", (message) => {
    const user = getUser(socket.id);

    console.log(message, "from messaxcge");
    // io.emit(
    //   "messageReceived",
    //   `https://google.com/maps?q=${message.lat},${message.long}`
    // );

    io.to(user.room).emit(
      "locationMessage",
      generateLocation(
        `https://google.com/maps?q=${message.lat},${message.long}`, user.username
      )
    );
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "messageReceived",
        generateMessage("A user has left")
      );
    }
  });
});
server.listen(port, () => console.log("listening on port " + port));
