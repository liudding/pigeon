const { channels, users } = require('../store')
const { events } = require('../sys_events')

async function join({socket, channel, message, user}) {
    const channelName = 'presence-' + channel;
    const channelId = user.app_id + ':' + channelName

    channel = await channels.get(channelId)
 
    if (!channel) {
        // log new channel
        channel = {
            name: channelName,
            presence: []
        }
    }

    // 加入 presence
    const clientInfo = message
    const exist = channel.presence.find(i => i.id === clientInfo.id);
    if (!exist) {
        clientInfo.socket_id = socket.id
        channel.presence.push(clientInfo)
        channels.put(channelId, channel);
    }

    socket.join(channelId);
    socket.emit(events.JOIN_SUCCUSS, channel);

    if (!exist) {
        socket.in(channelId).emit(events.MEMBER_JOINED, clientInfo);
    }
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
