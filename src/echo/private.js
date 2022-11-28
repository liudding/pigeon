const { channels, users } = require('../store')
const { events } = require('../sys_events')

async function join({socket, channel, message, user}) {
    if (!user || !user.authenticated) {
        return socket.emit(events.JOIN_ERROR, 'Unauthenticated');
    }

    channel = 'private-' + channel;
    const channelId = user.app_id + ':' + channel;
    socket.join(channelId);
    socket.emit(events.JOIN_SUCCUSS, channel);
}


module.exports = {
    join
}
