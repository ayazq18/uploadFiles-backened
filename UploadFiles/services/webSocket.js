const socketIO = require('socket.io');

let io;

exports.initWebSocket = (server) => {
    io = socketIO(server);
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};

exports.emitEvent = (event, data) => {
    if (io) {
        io.emit(event, data);
    }
};
