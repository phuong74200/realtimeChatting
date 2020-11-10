const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path')

const PORT = 443;

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log(req)
    console.log('A deviec has connected!')
    res.sendFile(path.join(__dirname + '/public/index.html'));
})


io.on('connect', (socket) => {
    console.log('socket connected');
    //console.log(socket.handshake)
    socket.on('client-send', (data) => {
        console.log('recive')
        if(data.trim() == '') return false;
        io.emit('server-send', data)
    })
})

http.listen(PORT, () => {
    console.log(`Running at: http://localhost:${PORT}`);
})