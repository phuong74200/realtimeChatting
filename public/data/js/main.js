const socket = io('ws://localhost:3000');

function appendMessage(data) {
    let message = document.createElement('div');
    message.className = 'message';
    message.textContent = data;
    document.getElementById('comeMessage').appendChild(message)
    document.getElementById('comeMessage').scrollTop = document.getElementById('comeMessage').scrollHeight;
}

socket.on('connect', (sdata) => {
    console.log(socket.id)
    socket.emit('login', { userId: socket.id });
    console.log('socket io listen 3000')
    socket.on('server-send', data => {
        appendMessage(data)
    });
    socket.on('server-load', data => {
        console.log(data)
        for (let mes of data) {
            appendMessage(`#${mes.userid} - ${mes.message}`)
        }
        appendMessage(`Do not share your personal data with anyone! Don't trust anyone in there :v`)
    });
});

document.getElementById('message').addEventListener('keyup', (e) => {
    if (e.which == 13) {
        submit();
    }
});

document.getElementById('submitBtn').addEventListener('touchstart', (e) => {
    submit();
});

document.getElementById('submitBtn').addEventListener('click', (e) => {
    submit();
});

function submit() {
    socket.emit('client-send', document.getElementById('message').value);
    document.getElementById('message').value = '';
    document.getElementById('message').focus();
}


(function () {
    document.getElementById('message').focus();
})();