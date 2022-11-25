const { rooms } = require('../store')
const { events } = require('../sys_events')


module.exports = new class Channel {
    join(socket, channel, message) {
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
    
    }
}