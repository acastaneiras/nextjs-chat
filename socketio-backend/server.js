const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origins: ['http://localhost:3000']
  }
});

let connectedUsers = [];
let messages = [];

io.on('connection', (socket) => {

  handleNewUser(socket.id);

  //Load messages on connection if any
  if (messages.length > 0) {
    socket.emit('updateMessages', messages);
  }

  //Sets or updates alias for a specific user
  socket.on('setAlias', (changedUser) => {
    let index = connectedUsers.findIndex(user => user.uuid === changedUser.uuid);
    connectedUsers[index]['alias'] = changedUser.alias;

    changeAliasForMessagesFrom(changedUser);
    io.emit('updateMessages', messages);
    io.emit("updateUsers", connectedUsers);

  })

  //Stores a message to the server and emits the changes to the frontend
  socket.on('storeMessage', (message) => {
    messages = [...messages, message];

    io.emit('updateMessages', messages);
  });

  //Remove user from the server on disconnect
  socket.on('disconnect', () => {
    let index = connectedUsers.findIndex(user => user.uuid === socket.id);
    connectedUsers.splice(index, 1);

    io.emit("updateUsers", connectedUsers);
  });
});

//Changes the alias for all the messages from a user
function changeAliasForMessagesFrom(changedUser) {
  messages = messages.map(message => {
    if (message.uuid === changedUser.uuid) {
      return { ...message, alias: changedUser.alias }
    }
    return message;
  })
}

//Assign user uuid and notice the frontend
function handleNewUser(uuid) {
  let connectedUser = {
    uuid: uuid,
    alias: ''
  };
  connectedUsers.push(connectedUser);

  io.to(uuid).emit("assignUser", connectedUser);
  io.emit("updateUsers", connectedUsers);
}

server.listen(1111, () => {
  console.log('Listening on *:1111');
});