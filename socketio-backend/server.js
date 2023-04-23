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

  //Load messages on connection if any
  if (messages.length > 0) {
    socket.emit('updateMessages', messages);
  }

  //Sets or updates alias for a specific user
  socket.on('setAlias', (changedUser) => {
    let index = connectedUsers.findIndex(user => user.uuid === changedUser.uuid);

    if (index >= 0) {
      connectedUsers[index]['alias'] = changedUser.alias;
      changeAliasForMessagesFrom(changedUser);
    } else {
      handleNewUser(socket.id, changedUser.alias);
    }
    io.emit('updateMessages', messages);
    io.emit("updateUsers", connectedUsers);
  })

  //Stores a message to the server and emits the changes to the frontend
  socket.on('storeMessage', (message) => {
    let index = connectedUsers.findIndex(user => user.uuid === message.uuid);

    if (index >= 0) {
      messages = [...messages, message];
      io.emit('updateMessages', messages);
    } else {
      io.to(socket.id).emit("resetConnection");
      io.emit('updateMessages', messages);
      io.to(socket.id).emit("updateUsers", connectedUsers);
    }

  });

  //Remove user from the server on disconnect
  socket.on('disconnect', () => {
    let index = connectedUsers.findIndex(user => user.uuid === socket.id);
    connectedUsers.splice(index, 1);

    io.to(socket.id).emit("closeConnection");

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
function handleNewUser(uuid, alias = '') {
  let connectedUser = {
    uuid: uuid,
    alias: alias
  };
  connectedUsers.push(connectedUser);

  io.to(uuid).emit("assignUser", connectedUser);
  io.emit("updateUsers", connectedUsers);
}

server.listen(1111, () => {
  console.log('Listening on *:1111');
});