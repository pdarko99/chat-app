const socket = io();

const messages = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;

const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("countUpdated", (count) => {
  console.log("The count has been updated!", count);
});

socket.on("messageReceived", (message) => {
  console.log(message, "from message received");
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });

  messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (location) => {
  console.log(location);
  const html = Mustache.render(locationTemplate, {
    username: location.username,
    location: location.text,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });

  messages.insertAdjacentHTML("beforeend", html);
});

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username, room);

socket.on("newUser", (user) => {
  console.log(user);
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

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
  }
});
