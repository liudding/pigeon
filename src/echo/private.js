const { rooms, users } = require('../store')
const { events } = require('../sys_events')

function join({socket, channel, message, user}) {
    if (!user || !user.authenticated) {
        return socket.emit(events.JOIN_ERROR, 'Unauthenticated');
    }

    const roomStore = rooms.of(user.app_id)
    channel = roomStore.get(channel)
 
    if (!channel) {
        // log new channel
    }

    socket.join(channel.name);


    if (!roomStore.get(room)) {
        roomStore.set(room, {
            presence: []
        })
    }

    // 加入 presence
    const clientInfo = message
    delete clientInfo.room
    clientInfo.socket_id = socket.id

    roomStore[room].presence.push(clientInfo)

    socket.emit(events.JOIN_SUCCUSS, { room: room, presence: rooms[room].clients });
}


module.exports = {
    join
}
