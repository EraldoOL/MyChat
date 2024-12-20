const express = require('express');
const socketIo = require('socket.io');
const { Server } = require('http');

const app = express();
const server = new Server(app); // Criação do servidor HTTP
const io = socketIo(server); // Inicializando o Socket.IO com o servidor HTTP

app.use(express.static('public')); // Servindo os arquivos estáticos
app.use('/imgs', express.static('imgs'));

// Configuração do socket.io
io.on('connection', (socket) => {
  console.log('Usuário conectado: ' + socket.id);

  socket.on('audio-stream', (audioBlob) => {
    socket.broadcast.emit('audio-stream', audioBlob);
  });

  
  socket.on('chatMessage', (msg) => {
  if (typeof msg === 'object' && msg.username && msg.message) {
    // Formata a mensagem no formato desejado
    const formattedMessage = `${msg.username.toUpperCase()}: ${msg.message}`;
    io.emit('message', formattedMessage);
  } else {
    console.error('Mensagem inválida recebida:', msg);
  }
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
