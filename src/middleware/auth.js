
import jwt_decode from "jwt-decode";

function auth(socket, next) {
    try {
        jwt_decode(socket.handshake.auth.token)
        next();
    } catch (error) {
        next(new Error("invalid auth token"));
    }
};


module.exports = auth