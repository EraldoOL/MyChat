// Criação da conexão com o servidor Socket.IO
const socket = io();

// Função para exibir mensagens no chat
function addMessage(message) {
    const li = document.createElement('li');
    li.textContent = message;
    messages.appendChild(li);
}

// Recebe mensagem do servidor e exibe
socket.on('message', (msg) => {
    addMessage(msg);
});

// Enviar mensagem quando o botão for clicado
sendButton.addEventListener('click', () => {
    const message = chatInput.value;
    if (message.trim()) {
        socket.emit('chatMessage', message);
        chatInput.value = '';
    }
});

// Enviar mensagem quando pressionar Enter
chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && chatInput.value.trim()) {
        socket.emit('chatMessage', chatInput.value);
        chatInput.value = '';
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
        chatInput.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
    };
}