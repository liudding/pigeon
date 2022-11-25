const { rooms } = require('../store')
const { events } = require('../sys_events')

function join({socket, channel, message}) {
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

    socket.emit(events.JOIN_SUCCUSS, { room: room, presence: rooms[room].presence });
    socket.in(room).emit(events.MEMBER_JOINED, clientInfo);
}

function leave({socket, name, message}) {

}

/**
 * 获取指定 Presence Channel 里的人数
 */
function count() {

}

/**
 * 获取指定人员的信息
 */
function get() {

}

function all() {

}

module.exports = {
    join
}
