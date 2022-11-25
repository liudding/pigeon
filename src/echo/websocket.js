
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const auth = require("../middleware/auth");
const wildcard = require("../middleware/wildcard");
const ratelimit = require("../middleware/ratelimit");
const { events: sysEvents, isSystemEvent, events } = require("../sys_events");
const config = require('../configs');
const systemLogger = require('../utils/logger').createLogger('system');
const PublicChannel = require('./public')
const PrivateChannel = require('./private')
const PresenceChannel = require('./presence')
const router = require('./router')()
const { users } = require('../store')
var io;

function initWebSocket(httpServer) {
    io = new Server(httpServer, {
        // path: '/',
        cors: {
            origin: ['localhost', '127.0.0.1', 'https://admin.socket.io', 'http://localhost:3302'],
            // methods: ["GET", "POST"],
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

    registerRoutes()

    return io;
}

function registerRoutes() {
    router.add('login', login)

    router.add('presence-:name/join', PresenceChannel.join)
    
    router.add('public-:name/join', PublicChannel.join)
    router.add('public-:name/broadcast/:event', PublicChannel.broadcast)
    router.add('public-:name/whisper/:event', PublicChannel.whisper)

    router.add('private-:name/:join', PrivateChannel.join)
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
            const message = packet.data[1];

            let roomId = null;

            const {route, params } = router.dispatch(packet.data[0])
            const user = users.get(socket.id)
            return route.handler({socket, channel: params.name, to: params.to, message, user})
           
          

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

function login({socket, message}) {
    // validate token

    const userId = message.id || message.user_id;
    // log user in
    if (!users[userId]) {
        users[userId] = {
            id: userId,
            authenticated: false,
            channels: []
        }
    }

    users[userId].authenticated = true;

    socket.emit(events.LOGIN_SUCCUSS)
}

module.exports = {
    initWebSocket,
    getWebSocket
};