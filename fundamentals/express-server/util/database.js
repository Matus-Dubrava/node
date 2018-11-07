const mongodb = require('mongodb');
const { MongoClient } = mongodb;

let _db;

const keys = require('../config');

const mongoConnect = cb => {
    MongoClient.connect(
        keys.mongodbURI,
        { useNewUrlParser: true }
    )
        .then(client => {
            console.log('CONNECTED...');
            _db = client.db();
            cb(client);
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    } else {
        throw new Error('No database found!');
    }
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
