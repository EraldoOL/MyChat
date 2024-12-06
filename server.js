// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuração do diretório público (onde os arquivos HTML, CSS, JS vão ficar)
app.use(express.static('public'));

// Quando um cliente se conectar ao servidor
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    // Enviar uma mensagem de boas-vindas ao cliente que se conectou
    socket.emit('message', 'Bem-vindo ao chat!');

    // Quando o servidor receber uma mensagem do cliente
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);  // Emitir a mensagem para todos os clientes conectados
    });

    // Quando o usuário se desconectar
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

// Configuração da porta do servidor
server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});