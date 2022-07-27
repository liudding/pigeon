
const jwt = require("jsonwebtoken")
const config = require("../configs")

// 也可使用公钥私钥来验证

function auth(socket, next) {
    try {
        jwt.verify(socket.handshake.query.token, config.jwt_secret)
        next();
    } catch (error) {
        next(new Error("invalid auth token"));
    }
};


module.exports = auth