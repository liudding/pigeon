
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const auth = require("../middleware/auth");
const wildcard = require("../middleware/wildcard");
const ratelimit = require("../middleware/ratelimit");
const { events } = require("../sys_events");
const config = require('../configs');
const systemLogger = require('../utils/logger').createLogger('system');
const PublicChannel = require('./public')
const PrivateChannel = require('./private')
const PresenceChannel = require('./presence')
const router = require('./router')()
const { users, channels } = require('../store')
var io;

function initWebSocket(httpServer) {
    io = new Server(httpServer, {
        // path: '/',
        cors: {
            // origin: ['localhost', '127.0.0.1', 'https://admin.socket.io', 'http://localhost:3302'],
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
        if (!socket.handshake.query.appid) {
            socket.emit(events.ERROR, 'invalid app id')
            socket.disconnect(true)
            return;
        }

        user = await users.get(socket.id)
        if (!user) {
            user = {
                app_id: socket.handshake.query.appid,
                socket_id: socket.id
            }
            users.put(socket.id, user)
        }

        socket.on('disconnecting', async () => {
            /**
             * 在 disconnect 事件中，获取不到 rooms。所以在 disconnecting 中通知其他成员
             */
            for (const channel of socket.rooms) {
                socket.in(channel).emit(events.MEMBER_LEFT, user)

                if (channel.indexOf(':presence-') > 0) {
                    const c = await channels.get(channel)
                    if (c) {
                        c.presence = c.presence.filter(i => i.socket_id !== socket.id)
                        channels.put(channel, c)
                    }
                }
            }

        })

        socket.on("disconnect", (reason) => {
            if (reason === 'server namespace disconnect' || reason === 'client namespace disconnect') {
                users.del(socket.id)
            }
        });

        socket.on('*', async function (packet) {
            const message = packet.data[1];

            const {route, params } = router.dispatch(packet.data[0])
            return route.handler({socket, channel: params.name, to: params.to, message, user})
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