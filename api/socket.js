const express = require('express');
const socketIo = require('socket.io');
const { Server } = require('http');

const app = express();
const server = new Server(app); // Criação do servidor HTTP
const io = socketIo(server); // Inicializando o Socket.IO com o servidor HTTP

app.use(express.static('public')); // Servindo os arquivos estáticos

// Configuração do socket.io
io.on('connection', (socket) => {
  console.log('Usuário conectado: ' + socket.id);

  socket.on('audio-stream', (audioBlob) => {
    socket.broadcast.emit('audio-stream', audioBlob);
  });

  socket.on('chatMessage', (msg) => {
    io.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado: ' + socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exporta o servidor para que a Vercel/Render possa usá-lo
module.exports = (req, res) => {
  server.emit('request', req, res);
};
