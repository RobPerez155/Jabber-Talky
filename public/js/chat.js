// Here we will connect to the server using websockets
const socket = io() // this allows us to send/receive events from both the server and the client

// server (emit) -> client (receive) --acknowledgement--> server
// client (emit) -> server (receive) --acknowledgement--> client

socket.on('message', (message) => {
  console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault()

  const message = event.target.elements.message.value

  socket.emit('sendMessage', message, (error) => { // The acknowledgement will always be the last func to run, we can add a variable name to utilize the data sent from the server.
    if (error) {
      return console.log(error)
    }

    console.log('Message delivered', dataSentBackFromServer)
  })
})

document.querySelector('#send-location').addEventListener('click', () => {

  if (!navigator.geolocation) { // Outdated browsers may not support geolocation
    return alert('Geolocation is not supported by your browser.')
  }

  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position.coords.latitude)
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, (sent) => {
      console.log('Location Sent')
    })
  })
})