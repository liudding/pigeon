const { channels, users } = require('../store')
const { events } = require('../sys_events')

async function join({ socket, channel, message, user }) {
    channel = 'public-' + channel;
    const channelId = user.app_id + ':' + channel;
    socket.join(channelId);
    socket.emit(events.JOIN_SUCCUSS, '');
}


function broadcast(socket, channel, event, message, user) {
    channel = 'private-' + channel;
    const channelId = user.app_id + ':' + channel;

    socket.to(channelId).emit(event, message)
}

async function whisper({ socket, name, to, event, message, io}) {
    io.sockets.socket(to).emit(event, message);
}

module.exports = {
    join,
    broadcast,
    whisper
}
