const express = require('express');
const socketIo = require('socket.io');
const { Server } = require('http');
const mongoose = require('mongoose');

// Substitua pela string de conexão com sua senha
const connectionString = 'mongodb+srv://Pionne:pionne@cluster0.mongodb.net/Messenger?retryWrites=true&w=majority';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado ao MongoDB com sucesso!');
})
.catch(err => {
  console.log('Erro ao conectar ao MongoDB:', err);
});

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

const Message = require('./models/message');  // Ajuste o caminho conforme necessário

io.on('connection', (socket) => {
  console.log('Usuário conectado: ' + socket.id);

  socket.on('chatMessage', (msg) => {
    // Salvar a mensagem no banco de dados
    const newMessage = new Message({
      username: msg.username,  // Ou outro dado que você envia
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
});

Message.find()
  .then(messages => {
    console.log(messages);  // Aqui você pode exibir as mensagens no console ou na interface do chat
  })
  .catch(err => {
    console.log('Erro ao buscar mensagens:', err);
  });

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
