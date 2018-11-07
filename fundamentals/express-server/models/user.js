const mongodb = require('mongodb');

const { getDb } = require('../util/database');

class User {
    constructor(name, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(id) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new mongodb.ObjectId(id) });
    }
}

module.exports = User;
