var express = require('express');
var router = express.Router();
const { getWebSocket } = require('../websocket');


router.get('/', function (req, res, next) {
    res.send('hello');
});

router.post('/publish/:room/:event/', function (req, res, next) {
    getWebSocket().to(req.params.room).boardcast.emit({ event: params.event, data: req.body });

    return res.send({ code: 200, msg: '发送成功' });
});

module.exports = router;