'use strict'

const { RateLimiterMemory } = require('rate-limiter-flexible');

module.exports = function (CustomEmitter) {

    const rateLimiter = new RateLimiterMemory(
        {
            points: 5, // 5 points
            duration: 1, // per second
        });

    return async function (socket, next) {
        try {
            // consume 1 point per event from IP
            await rateLimiter.consume(socket.handshake.address);
        } catch (rejRes) {
            // no available points to consume
            // emit error or warning message
            socket.emit('blocked', { 'retry-ms': rejRes.msBeforeNext });
        }

        return next ? next() : null
    }
}