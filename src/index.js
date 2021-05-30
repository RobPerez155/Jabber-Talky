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

io.on('connection', () => {
  console.log('New WebSocket Connection')
}) // here we are listening for a specific event to occur - ('name of event', (func to run) => {})

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})