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

// // Here is what's happening between index.js(server) and chat.js(client)
//   // server (emit) -> client (receive) - message
//   // client (emit) -> server (receive) - sendMessage

io.on('connection', (socket) => { // here we are listening for a specific event to occur and socket is the callback
  console.log('New WebSocket Connection')

  socket.emit('message', 'Welcome HomieDuck!')

  socket.on('sendMessage', (message) => {
    io.emit('message', message)
  })
}) 

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})