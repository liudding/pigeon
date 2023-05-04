const { rooms } = require('../store')
const { events } = require('../sys_events')


const { channels, users } = require('../store')
const { events } = require('../sys_events')

async function join({socket, channel, user}) {
    if (channel.private) {
        if (!user || !user.authenticated) {
            return socket.emit(events.JOIN_ERROR, 'Unauthenticated');
        }
    }

    const channelId = user.app_id + ':' + channel.name;
    socket.join(channelId);
    socket.emit(events.JOIN_SUCCUSS, channel.name);
}


async function leave({socket, channel, user}) {
    const channelId = user.app_id + ':' + channel.name;
    socket.leave(channelId)
    socket.emit(events.LEAVE_SUCCESS , channel.name);
}


function broadcast(socket, channel, event, message, user) {
    const channelId = user.app_id + ':' + channel.name;

    socket.to(channelId).emit(event, message)
}

async function whisper({ socket, name, to, event, message, io}) {
    io.sockets.socket(to).emit(event, message);
}

async function resetState() {
  // lock state

  // reset

  // unlock
}

async function saveTransaction() {

}

module.exports = {
    join,
    leave,
    broadcast,
    whisper
}
