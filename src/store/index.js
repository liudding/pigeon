const Store = require("./store");

module.exports = {
    users: new Store(),
    rooms: new Store(),
    apps: new Store()
}