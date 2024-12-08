const express = require('express');
const http = require('http'); // Correto uso do módulo HTTP
const socketIo = require('socket.io');
const mongoose = require('mongoose');

// Conectando ao MongoDB
const connectionString = 'mongodb+srv://Pionne:pionne@cluster0.mongodb.net/Messenger?retryWrites=true&w=majority';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado ao MongoDB com sucesso!');
})
.catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

// Definição do esquema e modelo de mensagem
const messageSchema = new mongoose.Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

// Inicializando o Express e o servidor HTTP
const app = express();
const server = http.createServer(app);

// Inicializando o Socket.IO
const io = socketIo(server);

// Configuração do Socket.IO
io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  // Recebendo e salvando mensagens no banco
  socket.on('chatMessage', async (msg) => {
    try {
      const newMessage = new Message({
        username: msg.username,
        message: msg.message,
      });

      await newMessage.save(); // Salvando no MongoDB
      console.log('Mensagem salva com sucesso!');

      io.emit('message', msg); // Enviando para todos os clientes conectados
    } catch (err) {
      console.error('Erro ao salvar mensagem:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Usuário desconectado: ${socket.id}`);
  });
});

// Servindo arquivos estáticos (opcional)
app.use(express.static('public'));

// Listando mensagens existentes ao conectar
Message.find()
  .then(messages => {
    console.log('Mensagens existentes:', messages);
  })
  .catch(err => {
    console.error('Erro ao buscar mensagens:', err);
  });

// Porta e inicialização do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
