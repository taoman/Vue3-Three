const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const rooms = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', ({ roomName, userName }) => {
    if (!rooms[roomName]) {
      rooms[roomName] = [];
    }
    rooms[roomName].push(socket.id);

    socket.join(roomName);
    socket.to(roomName).emit('userJoined', { userId: socket.id, userName });
  });

  socket.on('offer', ({ roomName, offer, targetId }) => {
    socket.to(targetId).emit('offer', { offer, from: socket.id });
  });

  socket.on('answer', ({ roomName, answer, targetId }) => {
    socket.to(targetId).emit('answer', { answer, from: socket.id });
  });

  socket.on('ice-candidate', ({ roomName, candidate, targetId }) => {
    socket.to(targetId).emit('ice-candidate', { candidate, from: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((id) => id !== socket.id);
      socket.to(room).emit('userLeft', { userId: socket.id });
    }
  });
});

server.listen(3000, () => console.log('Server is running on port 3000'));
