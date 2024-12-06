const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Definindo a variável io

app.use(express.static('public')); // Servindo os arquivos estáticos

// Configuração do socket.io
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    // Envia uma mensagem de boas-vindas quando um novo usuário conecta
    socket.emit('message', 'Bem-vindo ao chat!');

    // Lida com mensagens enviadas pelos usuários
    socket.on('chatMessage', (msg) => {
        // Emite a mensagem para todos os clientes conectados
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});