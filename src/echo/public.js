const { rooms } = require('../store')
const { events } = require('../sys_events')

function join({ socket, channel, message }) {
    const room = channel
    socket.join(room);
    roomId = room;

    if (!rooms[room]) {
        rooms[room] = {
            presence: []
        }
    }

    // 加入 presence
    const clientInfo = message
    delete clientInfo.room
    clientInfo.socket_id = socket.id

    rooms[room].presence.push(clientInfo)

    socket.emit(events.JOIN_SUCCUSS, { room: room, presence: rooms[room].clients });
}

function message(socket, name, message) {

}

function broadcast(socket, name, message) {

}

function whisper({ socket, name, to, message }) {

}

module.exports = {
    join,
    broadcast,
    whisper
}
