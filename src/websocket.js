
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const auth = require("./middleware/auth");
const wildcard = require("./middleware/wildcard");
const ratelimit = require("./middleware/ratelimit");
const { events: sysEvents, isSystemEvent } = require("./sys_events");
const config = require('./configs');

var io;
const rooms = {}


function initWebSocket(httpServer) {
    io = new Server(httpServer, {
        // path: '/',
        cors: {
            origin: ['localhost', '127.0.0.1', 'https://admin.socket.io'],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // io.use(auth).use(wildcard()).use(ratelimit());
    io.use(wildcard())

    instrument(io, {
        auth: false
    });

    handleEvents(io)

    
    io.listen(config.websocketPort);

    return io;
}


function getWebSocket() {
    return io;
}


function handleEvents(io) {
    io.on("connection", async (socket) => {
        socket.on("disconnect", () => {
            // remove from room clients
            // broadcast to others in the room
        });

        socket.on('*', async function (packet) {
            console.log(packet)

            const message = packet.data[0];

            let roomId = null;


            if (isSystemEvent(message.event)) {
                systemLogger.info(`${message.event} ${message.data}`);

                if (message.event === sysEvents.JOIN_ROOM) {
                    const room = message.data.room || message.data.room_id
                    socket.join(room);
                    roomId = room;

                    if (!rooms[room]) {
                        rooms[room] = {
                            clients: []
                        }
                    }

                    const clientInfo = message.data
                    delete clientInfo.room
                    clientInfo.socket_id = socket.id

                    rooms[room].clients.push(clientInfo)

                    socket.emit({ event: sysEvents.JOIN_ROOM_SUCCEEDED, data: { room: room, clients: rooms[room].clients } });
                    socket.broadcast.emit({ event: sysEvents.CLIENT_JOINED_ROOM, data: clientInfo });
                }



                return;
            }

            if (!message.to || message.to === 'others') {
                socket.to(socket.rooms[0]).emit({ event: message.event, data: message.data });
                return;
            }

            if (message.to === 'all') {
                // 找到room

                if (!socket.rooms) {
                    return;
                }

                socket.to(socket.rooms[0]).emit({ event: message.event, data: message.data });
                return;
            }


            if (message.to) {
                // 遍历 presence 列表，找到全部接收者 socket
                const sids = await io.in(socket.rooms[0]).fetchSockets();

                if (message.to.sid) {
                    message.to.sids = [message.to.sid]
                }

                if (!message.to.sids && !message.to.sid) {
                    message.to.sids = [];
                }

                if (!message.to.except) {
                    message.to.except = [];
                }

                const receivers = sids.filter(i => message.to.sids.indexOf(i.client.id) >= 0 && message.to.except.indexOf(i.client.id) < 0);

                for (const receiver of receivers) {
                    try {
                        receiver.emit({ event: message.event, data: message.data });
                    } catch (error) {

                    }
                }

                return;
            }
        });

    });

}

module.exports = {
    initWebSocket,
    getWebSocket
};