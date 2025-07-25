const express = require('express');
const socketIo = require('socket.io');
const { Server } = require('http');

const app = express();
const server = new Server(app); 
const io = socketIo(server); 

app.use(express.static('public')); 
app.use('/imgs', express.static('imgs'));

io.on('connection', (socket) => {
  console.log('Usuário conectado: ' + socket.id);

  socket.on('audio-stream', (audioBlob) => {
    socket.broadcast.emit('audio-stream', audioBlob);
  });

  socket.on('chatMessage', (msg) => {
  if (typeof msg === 'object' && msg.username && msg.message) {
    
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

module.exports = (req, res) => {
  server.emit('request', req, res);
};
