const socket = io();

socket.on("countUpdated", (count) => {
  console.log("The count has been updated!", count);
});

socket.on("messageReceived", (message) => {
  console.log(message);
});

socket.on('newUser', (user) => {
  console.log(user);
})

document.querySelector("#increment").addEventListener("click", () => {
  console.log("clicked");
  socket.emit("increment");
});

document.querySelector("#sub").addEventListener("click", () => {
  let message = document.querySelector("#message");
  console.log(message.value);
  socket.emit("message", message.value);
  console.log(message);
});
