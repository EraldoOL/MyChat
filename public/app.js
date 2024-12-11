import {} from '../api/socket.js';

// Criação da conexão com o servidor Socket.IO
const socket = io(); // Inicializa a conexão

function sendMessage() {
  const message = document.getElementById('chat-input').value;
  const username = 'Usuário';  // Ou qualquer valor que você queira usar como nome de usuário

  // Envia a mensagem para o servidor
  socket.emit('chatMessage', { username: username, message: message });

  // Limpa o campo de input
  document.getElementById('chat-input').value = '';
}

// Função para exibir mensagens no chat
function addMessage(message) {
    const li = document.createElement('li');
    li.textContent = message;
    document.getElementById('messages').appendChild(li);
}

// Recebe mensagem do servidor e exibe
socket.on('message', (msg) => {
    addMessage(msg);
});
// No lado do cliente para receber o stream de áudio
socket.on('audio-stream', (audioBlob) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
});

// Enviar mensagem quando o botão for clicado
document.getElementById('send-btn').addEventListener('click', () => {
    const message = document.getElementById('chat-input').value;
    if (message.trim()) {
        socket.emit('chatMessage', message);  // Envia a mensagem para o servidor
        document.getElementById('chat-input').value = '';  // Limpa o campo de input
    }
});

// Enviar mensagem quando pressionar Enter
document.getElementById('chat-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && document.getElementById('chat-input').value.trim()) {
        socket.emit('chatMessage', document.getElementById('chat-input').value);  // Envia a mensagem para o servidor
        document.getElementById('chat-input').value = '';  // Limpa o campo de input
    }
});

// Função para iniciar o reconhecimento de voz
const micButton = document.getElementById('microphone-btn');

if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;
    
    micButton.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        document.getElementById('chat-input').value = transcript;

        // Enviar o texto transcrito como uma mensagem
        socket.emit('chatMessage', transcript);
    };

    recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
    };
}

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioTracks = stream.getAudioTracks();
    console.log('Microfone ativado:', audioTracks[0].label);

    // Criar um objeto de conexão de áudio e enviar para o servidor (via socket.io)
    const audio = new Audio();
    audio.srcObject = stream;
    audio.play();

    // Enviar o stream de áudio via socket para o servidor
    socket.emit('audio-stream', stream);
  })
  .catch(err => {
    console.error('Erro ao acessar o microfone:', err);
  });





/*const socket = io();

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


const chatInput = document.getElementById('chat-input');
const typingIndicator = document.getElementById('typing-indicator');

let typingTimeout;

// Notifica o servidor quando começa a digitar
chatInput.addEventListener('input', () => {
  socket.emit('typing', 'Usuário');
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('stopTyping');
  }, 2000); // Envia "parar de digitar" após 2 segundos sem digitar
});

// Exibe o indicador quando outro usuário está digitando
socket.on('userTyping', (username) => {
  typingIndicator.style.display = 'flex';
});

// Oculta o indicador quando outro usuário para de digitar
socket.on('userStopTyping', () => {
  typingIndicator.style.display = 'none';
});*/