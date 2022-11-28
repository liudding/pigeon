const { channels, users } = require('../store')
const { events } = require('../sys_events')

async function join({ socket, channel, message, user }) {
    channel = 'public-' + channel;
    const channelId = user.app_id + ':' + channel;
    socket.join(channelId);
    socket.emit(events.JOIN_SUCCUSS, '');
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
