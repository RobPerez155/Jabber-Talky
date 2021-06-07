// Here we will connect to the server using websockets
const socket = io() // this allows us to send/receive events from both the server and the client

socket.on('message', (message) => {
  console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
  event.preventDefault()

  const message = event.target.elements.message.value

  socket.emit('sendMessage', message)
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
    })
  })
})