const { Server } = require('socket.io');

let io;

module.exports = (req, res) => {
  if (!res.socket.server.io) {
    console.log('Iniciando Socket.IO...');
    io = new Server(res.socket.server);

    io.on('connection', (socket) => {
      console.log('Usuário conectado: ' + socket.id);

      // Lida com mensagens enviadas pelos usuários
      socket.on('chatMessage', (msg) => {
        io.emit('message', msg); // Emite a mensagem para todos os clientes conectados
      });

      socket.on('disconnect', () => {
        console.log('Usuário desconectado: ' + socket.id);
      });
    });

    res.socket.server.io = io; // Associar o servidor ao objeto `res`
  }
  res.end(); // Finaliza a resposta
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});