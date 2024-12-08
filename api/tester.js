const mongoose = require('mongoose');

// String de conexão
const uri = "mongodb+srv://Pionne:pionne@cluster0.mongodb.net/Messenger?retryWrites=true&w=majority";

// Testando a conexão
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conexão com o MongoDB foi bem-sucedida!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });
