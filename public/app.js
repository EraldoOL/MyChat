const socket = io();

// Função para enviar mensagem
function sendMessage() {
  const message = document.getElementById('chat-input').value;
  const username = 'Usuário';  // Ou qualquer valor que você queira usar como nome de usuário

  // Envia a mensagem para o servidor
  socket.emit('chatMessage', { username: username, message: message });

  // Limpa o campo de input
  document.getElementById('chat-input').value = '';
}

// Recebe a mensagem do servidor e exibe na tela
socket.on('message', (msg) => {
  const chatContainer = document.getElementById('messages');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.textContent = `${msg.username}: ${msg.message}`;
  chatContainer.appendChild(messageDiv);

  // Rola para o final da tela
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

// Função para gravar áudio
let mediaRecorder;
let audioChunks = [];

document.getElementById('microphone-btn').addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    // Parar a gravação de áudio
    mediaRecorder.stop();
  } else {
    // Iniciar a gravação de áudio
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        mediaRecorder.ondataavailable = event => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          socket.emit('audio-stream', audioBlob);
          audioChunks = []; // Limpar o array de áudio

          // Criar um URL para o áudio gravado e exibir na tela
          const audioUrl = URL.createObjectURL(audioBlob);
          const audioElement = document.createElement('audio');
          audioElement.src = audioUrl;
          audioElement.controls = true;
          document.getElementById('messages').appendChild(audioElement);
        };
      })
      .catch(err => {
        console.error('Erro ao acessar o microfone:', err);
      });
  }
});
