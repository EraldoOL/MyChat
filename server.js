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

// Função para iniciar o reconhecimento de voz
const micButton = document.getElementById('microphone-btn');
let mediaRecorder;
let audioChunks = [];

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
        socket.emit('chatMessage', transcript); // Enviar o texto transcrito como uma mensagem
    };

    recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
    };
}

// Gravação de áudio
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        // Criando o MediaRecorder para gravar o áudio
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();

            // Envia o áudio gravado para o servidor
            socket.emit('audio-stream', audioBlob);
        };

        micButton.addEventListener('click', () => {
            if (mediaRecorder.state === 'inactive') {
                audioChunks = [];
                mediaRecorder.start();
            } else {
                mediaRecorder.stop();
            }
        });
    })
    .catch(err => {
        console.error('Erro ao acessar o microfone:', err);
    });