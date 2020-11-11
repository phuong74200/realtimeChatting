const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { wsEngine: 'ws' });
const path = require('path')
const seedrandom = require('seedrandom')
let db = require('nedb');

db.messages = new db(path.join(`${__dirname}/data/database/message.db`));
db.messages.loadDatabase();

console.log(seedrandom.alea('123').int32())

const PORT = 3000;

let messageStorage = [];

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log(req)
    console.log('A deviec has connected!')
    res.sendFile(path.join(__dirname + '/public/index.html'));
})

let users = {};

io.on('connect', (socket) => {
    //console.log(socket.handshake)

    function sendMessage(data) {
        io.emit('server-send', `#${users[socket.id]} - ${data}`)
        db.messages.insert({
            userid: users[socket.id],
            message: data,
            id: ""
        })
        messageStorage.push(data)
    }

    socket.on('client-send', (data) => {
        if (data.trim() == '') return false;
        io.emit('server-send', `#${users[socket.id]} - ${data}`)
        db.messages.insert({
            userid: users[socket.id],
            message: data,
            _id: ""
        })
        messageStorage.push(data)
    })

    db.messages.find({}, (err, docs) => {
        socket.emit('server-load', docs)
    })

    socket.on('login', function (data) {
        data.userId = Math.abs(seedrandom(data.userId).int32()).toString().slice(0, 5);
        users[socket.id] = data.userId;
        console.log(data.userId + ' connected');
        io.emit('server-send', `#${users[socket.id]} has joined in`)
        messageStorage.push(`#${users[socket.id]} has joined in`)
        users[socket.id] = data.userId;
    });

    socket.on('disconnect', function () {
        console.log('user ' + users[socket.id] + ' disconnected');
        io.emit('server-send', `#${users[socket.id]} has leave`)
        messageStorage.push(`#${users[socket.id]} has leave`)
        delete users[socket.id];
    });
})

http.listen(PORT, () => {
    console.log(`Running at: http://localhost:${PORT}`);
})