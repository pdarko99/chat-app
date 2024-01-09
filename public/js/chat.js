const socket = io();

socket.on("countUpdated", (count) => {
  console.log("The count has been updated!", count);
});

socket.on("messageReceived", (message) => {
  console.log(message);
});

socket.on("newUser", (user) => {
  console.log(user);
});

document.querySelector("#increment").addEventListener("click", () => {
  console.log("clicked");
  socket.emit("increment");
});

let btn = document.querySelector("#sub").addEventListener("click", () => {
  // btn.setAttribute("disabled", 'disabled')
  let message = document.querySelector("#message");
  console.log(message.value);
  socket.emit("message", message.value, (error) => {
    if (error) return console.log(error);
    console.log("the message was delivered");
  });
  console.log(message);
});

document.querySelector("#location").addEventListener("click", () => {
  if (!navigator.geolocation) return alert("geolocation is not supported");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });
  });
});
