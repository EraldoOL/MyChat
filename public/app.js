
const socket = io();

function addMessage(message) {
    const li = document.createElement('li');
    li.textContent = message;
    document.getElementById('messages').appendChild(li);
}

socket.on('message', (msg) => {
    addMessage(msg);
});

socket.on('audio-stream', (audioBlob) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
});


document.getElementById('send-btn').addEventListener('click', () => {
    const message = document.getElementById('chat-input').value;
    if (message.trim()) {
        socket.emit('chatMessage', message);
        document.getElementById('chat-input').value = '';
    
    }
    
});

document.getElementById('chat-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && document.getElementById('chat-input').value.trim()) {
        socket.emit('chatMessage', document.getElementById('chat-input').value);  
        document.getElementById('chat-input').value = '';
    }
});

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

    const audio = new Audio();
    audio.srcObject = stream;
    audio.play();

    socket.emit('audio-stream', stream);
  })
  .catch(err => {
    console.error('Erro ao acessar o microfone:', err);
  });