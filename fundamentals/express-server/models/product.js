const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(p, (err, data) => {
            if (err) {
                resolve([]);
            }

            resolve(JSON.parse(data));
        });
    });
};

module.exports = class Product {
    constructor(id = null, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile().then(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    p => p.id === this.id
                );
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;

                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    if (err) {
                        console.error(err);
                    }
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);

                fs.writeFile(p, JSON.stringify(products), err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile().then(products => {
            const updatedProducts = products.filter(
                product => product.id !== id
            );

            const productToDelete = products.find(product => product.id === id);

            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (err) {
                    console.log(err);
                } else {
                    Cart.removeProduct(id, productToDelete.price);
                }
            });
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            getProductsFromFile().then(products => {
                const product = products.find(product => product.id === id);

                resolve(product);
            });
        });
    }

    static fetchAll() {
        return getProductsFromFile();
    }
};
