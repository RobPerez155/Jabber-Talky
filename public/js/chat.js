// I AM Client
// Here we will connect to the server using websockets
const socket = io(); // this allows us to send/receive events from both the server and the client

// server (emit) -> client (receive) --acknowledgement--> server
// client (emit) -> server (receive) --acknowledgement--> client

// Elements
const $messageForm = document.querySelector("#message-form"); // $ Is a convention to let us know that is this is an element from the DOM
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML; //.innerHTML is what we need in order to render our templates correctly
const locationTemplate = document.querySelector("#location-template").innerHTML;

//Options - Parses the params into an object
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
}); // We are destructuring the object

socket.on("message", (message) => {
  console.log(message);
  // this will store the final html that we will be rendering to the browser
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text, // This takes a key value pair
    createdAt: moment(message.createdAt).format("h:mm a"),
  }); // The second argument is an object of the data we want rendered
  $messages.insertAdjacentHTML("beforeend", html); // tells us where to place the most recent message content
});

socket.on("locationMessage", (url) => {
  const html = Mustache.render(locationTemplate, {
    username: url.username,
    url,
    createdAt: moment(url.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Disable the form to prevent multiple submissions
  $messageFormButton.setAttribute("disabled", "disabled");

  const message = event.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    // The acknowledgement will always be the last func to run, we can add a variable name to utilize the data sent from the server.

    // Enable form after the sendMessage action is acknowledged by the server
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = ""; // Clears message input
    $messageFormInput.focus(); // Focuses on input box for user to continue typing

    if (error) {
      return console.log(error);
    }

    console.log("Message delivered", dataSentBackFromServer);
  });
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    // Outdated browsers may not support geolocation
    return alert("Geolocation is not supported by your browser.");
  }

  // Disable button
  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position.coords.latitude)
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        // This will be acknowledged in index.js #41
        // Enable button
        $sendLocationButton.removeAttribute("disabled");
        console.log("Location Sent");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
