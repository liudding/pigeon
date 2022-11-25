const path = require('path');

module.exports = {
    env: process.env.NODE_ENV || 'local',

    websocketPort: Number(process.env.PORT) || 3301,
    httpPort: Number(process.env.ADMIN_PORT) || 3302,
    debugMode: process.env.DEBUG_MODE === 'true',

    appName: 'chaosocket',
    sysEventPrefix: '',

    jwt_secret: '',


    logDir: path.join(global.appRoot, '../logs'),

    // 临时文件目录    
    tmpDir: '/tmp/puppy',

}