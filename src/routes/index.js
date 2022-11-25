var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
const { getWebSocket } = require('../echo/websocket');


router.get('/', function (req, res, next) {
    // res.send('hello');
    res.sendFile(__dirname + '/index.html');
});

router.get('/status', function(req, res) {
    // TODO: 展示系统各项状态
    res.send('i am fine')
})

router.post('/publish/:room/:event/', function (req, res, next) {
    getWebSocket().to(req.params.room).boardcast.emit({ event: params.event, data: req.body });

    return res.send({ code: 200, msg: '发送成功' });
});

module.exports = router;