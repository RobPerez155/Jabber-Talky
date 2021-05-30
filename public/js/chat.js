// Here we will connect to the server using websockets
const socket = io() // this allows us to send/receive events from both the server and the client

socket.on('countUpdated', (count) => {   // on -> On event do ...
  console.log(`The Count has been updated to ${count}`)
})

document.querySelector('#increment').addEventListener('click', () => {
  console.log('Clicked')
  socket.emit('increment') // Sending info to the server
})