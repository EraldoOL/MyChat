// Criação da conexão com o servidor Socket.IO
const socket = io(); // Inicializa a conexão

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