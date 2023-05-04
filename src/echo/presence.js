const { channels } = require('../store')
const { events } = require('../sys_events')

async function join({socket, channel, message, user}) {
    if (channel.private) {
        if (!user || !user.authenticated) {
            return socket.emit(events.JOIN_ERROR, 'Unauthenticated');
        }
    }

    const channelId = user.app_id + ':' + channel.name
    model = await channels.get(channelId)
 
    if (!model) {
        // log new channel
        model = {
            name: channel.name,
            presence: []
        }
    }

    // 加入 presence
    const clientInfo = message
    const exist = model.presence.find(i => i.id === clientInfo.id);
    if (!exist) {
        clientInfo.socket_id = socket.id
        model.presence.push(clientInfo)
        channels.put(channelId, model);
    }

    socket.join(channelId);
    socket.emit(events.JOIN_SUCCUSS, model);

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
