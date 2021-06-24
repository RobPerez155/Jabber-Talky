const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages.js')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

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

  socket.on('join', ({ username, room}, callback) => {
    const {error, user } = addUser({ id: socket.id, username, room })
    
    if (error) {
      return callback(error)
    }

    socket.join(user.room) // this allows users to send messages to a specific room
    
    socket.emit('message', generateMessage('Admin','Welcome HomieDuck!')) // socket Sends message to current user only
    socket.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    // io.to.emit, socket.broadcast.to.emit - used to send messages in a specific room
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `Homieduck ${user.username} has joined!`)) // broadcast.to sends message to everyone in the room except current user

    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    const filter = new Filter()

    if (filter.isProfane(message)) { // This scans the message for profanity before allowing it to be emitted
      return callback('Profanity is not allowed!')
    }
    //else {
    io.to(user.room).emit('message', generateMessage(user.username, message)) // io Sends a message to everyone
     
    callback('Data from server') // This will acknowledge the event was successful, we can also send back data to the client from here 
    //}
  })

  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id)

    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)) // This will give us a clickable link to the location.
    callback()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('message', generateMessage('Admin', `Homieduck ${user.username} has left!`))
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }

  })
}) 

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})