const mongoose = require('mongoose');

// Conectando ao MongoDB
mongoose.connect('mongodb+srv://Pionne:eraldo@cluster0.rw9vw.mongodb.net/Messenger?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB com sucesso!'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));
