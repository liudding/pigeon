const config = require('./configs');

const handlers = {}



function on(event, handler) {
    handlers[event] = handler;
}


function isSystemEvent(event) {
    for (const key in events) {
        if (events[key] === event) {
            return true;
        }
    }

    return false;
}


const events = {
    ERROR: config.sysEventPrefix + 'error',

    LOGIN_SUCCUSS: config.sysEventPrefix + 'login_success',

    JOIN_SUCCUSS: config.sysEventPrefix + 'join_succeess',
    JOIN_ERROR: config.sysEventPrefix + 'join_error',
    
    MEMBER_JOINED: config.sysEventPrefix + 'member_joined',
}


module.exports = { events, isSystemEvent }