const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Inicializando o Socket.IO

app.use(express.static('public')); // Servindo os arquivos estáticos

// Configuração do socket.io
io.on('connection', (socket) => {
  console.log('Usuário conectado: ' + socket.id);

  socket.on('audio-stream', (audioBlob) => {
    // Enviar o áudio para todos os outros clientes conectados
    socket.broadcast.emit('audio-stream', audioBlob);
  });

  // Lida com mensagens enviadas pelos usuários
  socket.on('chatMessage', (msg) => {
    // Emite a mensagem para todos os clientes conectados
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado: ' + socket.id);
  });
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});