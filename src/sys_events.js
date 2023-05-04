const config = require('./configs');

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
    
    LEAVE_SUCCESS: config.sysEventPrefix + 'leave_success',

    MEMBER_JOINED: config.sysEventPrefix + 'member_joined',
    MEMBER_LEFT: config.sysEventPrefix + 'member_left'
}


module.exports = { events, isSystemEvent }