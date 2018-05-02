const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
	console.log('New user connected.');

	socket.emit('newMessage', {
		from: 'Admin',
		text: 'Welcome to the chatroom!',
	});

	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'A new user has joined the chat!',
	});

	socket.on('createMessage', message => {
		console.log('New message:', message);
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime(),
		});
	});

	socket.on('disconnect', socket => {
		console.log('User was disconnected.');
	});
});

server.listen(port, () => {
	console.log(`Server is up at port ${port}`);
});
