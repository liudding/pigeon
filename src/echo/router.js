

// <channel>-<name>/<event>/<to>

var pathRegexp = require('path-to-regexp');

function Router() {
    if (!(this instanceof Router)) {
        return new Router();
    }

    this.routes = [];
}

Router.prototype.add = function (route, handler) {
    const keys = [];
    const regex = pathRegexp(route, keys);
    this.routes.push({
        route,
        regex,
        keys,
        handler
    })


}

Router.prototype.dispatch = function dispatch(uri) {
    for (const route of this.routes) {
        const match = route.regex.exec(uri)

        if (!match) {
            continue;
        }

        const params = {};

        for (var i = 1; i < match.length; i++) {
            var key = route.keys[i - 1];
            var prop = key.name;
            var val = decode_param(match[i])

            if (val !== undefined || !(Object.prototype.hasOwnPropert.call(params, prop))) {
                params[prop] = val;
            }
        }

        return {
            route,
            params
        }
    }

    throw new Error('route not found')
}


function decode_param(val) {
    if (typeof val !== 'string' || val.length === 0) {
        return val;
    }

    try {
        return decodeURIComponent(val);
    } catch (err) {
        if (err instanceof URIError) {
            err.message = 'Failed to decode param \'' + val + '\'';
            err.status = err.statusCode = 400;
        }

        throw err;
    }
}

module.exports = Router