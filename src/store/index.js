const Store = require("./store");

module.exports = {
    users: new Store(),
    channels: new Store(),
    apps: new Store()
}