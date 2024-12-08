const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const { Server } = require('http');

// Conexão com o MongoDB
const connectionString = 'mongodb+srv://Pionne:eraldo@cluster0.rw9vw.mongodb.net/Messenger?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB com sucesso!');
}).catch(err => {
  console.log('Erro ao conectar ao MongoDB:', err);
});

// Definição do schema para mensagens
const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// Inicializando Express e Socket.IO
const app = express();
const server = new Server(app);
const io = socketIo(server);

// Rota para servir arquivos estáticos (se necessário)
app.use(express.static('public'));

// Conexão do socket.io
io.on('connection', (socket) => {
  console.log('Usuário conectado: ' + socket.id);

  // Evento de receber mensagem do cliente
  socket.on('chatMessage', (msg) => {
    // Criando uma nova mensagem e salvando no banco
    const newMessage = new Message({
      username: msg.username,
      message: msg.message,
    });

    newMessage.save()
      .then(() => {
        console.log('Mensagem salva com sucesso!');
      })
      .catch((err) => {
        console.log('Erro ao salvar mensagem:', err);
      });

    // Emitir a mensagem para todos os clientes conectados
    io.emit('message', msg);
  });

  // Evento de áudio
  socket.on('audio-stream', (audioBlob) => {
    console.log('Recebendo áudio...');
    socket.broadcast.emit('audio-stream', audioBlob);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado: ' + socket.id);
  });
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
