const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

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

  socket.emit('message', 'Welcome HomieDuck!') // socket Sends message to current user only
  
  socket.broadcast.emit('message', 'A new homieduck has joined!') // broadcast Sends message to everyone except current user

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter()

    if (filter.isProfane(message)) { // This scans the message for profanity before allowing it to be emitted
      return callback('Profanity is not allowed!')
    }
    //else {
    io.emit('message', message) // io Sends a message to everyone
    callback('Data from server') // This will acknowledge the event was successful, we can also send back data to the client from here 
    //}
  })

  socket.on('sendLocation', (coords, callback) => {
    io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`) // This will give us a clickable link to the location.
    return callback()
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A homieduck has left!')
  })
}) 

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})