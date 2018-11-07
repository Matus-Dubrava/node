const mongodb = require('mongodb');

const { getDb } = require('../util/database');

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: newQuantity
            });
        }

        const updateCart = {
            items: updatedCartItems
        };

        const db = getDb();
        return db
            .collection('users')
            .updateOne({ _id: this._id }, { $set: { cart: updateCart } });
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(item => item.productId);
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    };
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    deleteItemFromCart(productId) {
        const db = getDb();

        const updatedItems = this.cart.items.filter(
            product => product.productId.toString() !== productId
        );

        return db
            .collection('users')
            .updateOne(
                { _id: this._id },
                { $set: { cart: { items: updatedItems } } }
            );
    }

    static findById(id) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({ _id: new mongodb.ObjectId(id) });
    }
}

module.exports = User;
