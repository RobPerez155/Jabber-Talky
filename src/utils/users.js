const users = []

const addUser = ({ id, username, room}) => { // Here we destructure the arguments
  // Clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are required!'
    }
  }

  // Check for existing user - will return boolean
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  // Validate username
  if (existingUser) {
    return {
      error: 'Username is in use!'
    }
  }

  // Store user - will add user to the users array
  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => user.id === id)

  if ( userIndex !== -1) {
    return users.splice(userIndex, 1)[0] // .splice(user's index value in the array, how many items to remove ) [0] returns the users we removed
  }
}

const getUser = (id) => {
  return users.find((user) => user.id === id) // find will stop searching after first match
}

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room) // filter will continue searching through entire array
}

module.exports = {
  addUser, 
  removeUser, 
  getUser, 
  getUsersInRoom
}