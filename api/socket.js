const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const { Server } = require('http');



io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);

    // Evento quando o usuário envia o nome ao conectar
    socket.on('userConnected', (username) => {
        console.log(`${username} entrou no chat.`);
    });

    // Restante do código do servidor...
});


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

  // Buscar todas as mensagens salvas no banco de dados e enviá-las para o cliente
  Message.find().then(messages => {
    socket.emit('allMessages', messages);  // Enviar todas as mensagens para o cliente
  }).catch(err => {
    console.log('Erro ao recuperar mensagens:', err);
  });

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

    // Transmitir o áudio para todos os outros clientes conectados
    socket.broadcast.emit('audio-stream', audioBlob);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado: ' + socket.id);
  });
});

// Notifica quando alguém começa a digitar
socket.on('typing', (username) => {
  socket.broadcast.emit('userTyping', username);
});

// Notifica quando a digitação para
socket.on('stopTyping', () => {
  socket.broadcast.emit('userStopTyping');
});






io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);

    // Evento quando o usuário envia o nome ao conectar
    socket.on('userConnected', (username) => {
        console.log(`${username} entrou no chat.`);
    });

    // Restante do código do servidor...
});






// Iniciando o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
