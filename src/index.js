const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express() // This generates a new express application
const server = http.createServer(app)
const io = socketio(server) // #7 & #8 are what we need to enable our server to support websockets

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

// Here is what's happening between index.js(server) and chat.js(client)
  // server (emit) -> client (receive) - countUpdated
  // client (emit) -> server (receive) - increment

io.on('connection', (socket) => { // here we are listening for a specific event to occur and socket is an obj
  console.log('New WebSocket Connection')

  socket.emit('countUpdated', count)   // emit sends an event from the server to the client, anything past the first argument, which is our event name, is going to be available from the callback func on the client

  socket.on('increment', () => {
    count++
    // socket.emit('countUpdated', count) ---> This updates only one connection
    io.emit('countUpdated', count) // This updates all connections
  })
}) 

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})