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