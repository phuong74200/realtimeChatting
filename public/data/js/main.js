const socket = io('ws://localhost:3000');

socket.on('connect', () => {
    console.log('socket io listen 3000')
    socket.on('server-send', data => {
        console.log(data)
        let message = document.createElement('div');
        message.className = 'message';
        message.textContent = data;
        document.getElementById('comeMessage').appendChild(message)
    })

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