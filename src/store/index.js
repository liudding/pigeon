
module.exports = class Store {

    constructor() {
        this.data = new Map();;
    }

    async get(key) {
        return await this.data.get(key);
    }

    async set(key, value) {
        return await this.data.set(key, value);
    }

    async del(key) {
        return await this.data.del(key);
    }

}