const mongodb = require('mongodb');

const { getDb } = require('../util/database');

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db;
            dbOp.collection('products').updateOne(
                { _id: this._id },
                { $set: this }
            );
        } else {
            dbOp = db;
        }
        return dbOp
            .collection('products')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.error(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('products')
            .find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch(err => {
                console.error(err);
            });
    }

    static findById(id) {
        const db = getDb();
        return db
            .collection('products')
            .find({ _id: new mongodb.ObjectId(id) })
            .next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.error(err);
            });
    }

    static deleteById(id) {
        const db = getDb();
        return db
            .collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(id) })
            .then(result => {
                console.log('DELETED');
            })
            .catch(err => {
                console.error(err);
            });
    }
}

// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

module.exports = Product;
