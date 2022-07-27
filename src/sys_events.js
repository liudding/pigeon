const config = require('./configs');


const handlers = {}



function on(event, handler) {
    handlers[event] = handler;
}



module.exports = {
    ERROR: config.sysEventPrefix + 'error',

    JOIN_ROOM: config.sysEventPrefix + 'join_room',
    JOIN_ROOM_SUCCEEDED: config.sysEventPrefix + 'join_room_succeeded',
    CLIENT_JOINED_ROOM: config.sysEventPrefix + 'client_joined_room',

    JOIN_CHANNEL: config.sysEventPrefix + 'join_channel',
    JOIN_CHANNEL_SUCCEEDED: config.sysEventPrefix + 'join_channel_succeeded',
}