
module.exports = class Store {

    constructor(prefix = '') {
        this.data = new Map();
        this.prefix = prefix
    }

    async get(key) {
        return await this.data.get(this.key(key));
    }

    async set(key, value) {
        return await this.data.set(this.key(key), value);
    }

    async put(key, value) {
        return await this.data.set(this.key(key), value);
    }

    async del(key) {
        return await this.data.delete(this.key(key));
    }

    of(prefix) {
        this.prefix = prefix;
        return this;
    }

    key(key) {
        return this.prefix + key 
    }

}