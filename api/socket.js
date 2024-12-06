const express = require('express');
const socketIo = require('socket.io');
const { Server } = require('http');

const app = express();
const server = new Server(app);
const io = socketIo(server); // Inicializando o Socket.IO

app.use(express.static('public')); // Servindo os arquivos estáticos

// Configuração do socket.io
io.on('connection', (socket) => {
  console.log('Usuário conectado: ' + socket.id);

  socket.on('audio-stream', (audioBlob) => {
    // Enviar o áudio para todos os outros clientes conectados
    socket.broadcast.emit('audio-stream', audioBlob);
  });

  socket.on('chatMessage', (msg) => {
    io.emit('message', msg); // Emite a mensagem para todos os clientes conectados
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado: ' + socket.id);
  });
});

// Exporta o servidor para que a Vercel possa usá-lo
module.exports = (req, res) => {
  server.emit('request', req, res);
};