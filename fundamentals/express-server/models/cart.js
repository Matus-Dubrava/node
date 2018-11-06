const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, data) => {
            let cart = {
                products: [],
                totalPrice: 0
            };

            if (!err) {
                cart = JSON.parse(data);
            }

            const existingProductIndex = cart.products.findIndex(
                product => product.id == id
            );
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {
                    id,
                    qty: 1
                };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice;

            fs.writeFile(p, JSON.stringify(cart), err => {
                console.error(err);
            });
        });
    }

    static removeProduct(id, productPrice) {
        fs.readFile(p, (err, data) => {
            if (!err) {
                const cart = JSON.parse(data);

                const existingProduct = cart.products.find(
                    product => product.id === id
                );
                let priceToDeduce = 0;
                if (existingProduct) {
                    priceToDeduce = productPrice * existingProduct.qty;
                }

                const updatedProducts = cart.products.filter(
                    product => product.id !== id
                );
                const updatedPrice = cart.totalPrice - priceToDeduce;
                const updatedCart = Object.assign({}, cart, {
                    products: updatedProducts,
                    totalPrice: updatedPrice
                });

                fs.writeFile(p, JSON.stringify(updatedCart), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    static getCart() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, (err, data) => {
                if (!err) {
                    const cart = JSON.parse(data);
                    resolve(cart);
                } else {
                    resolve(null);
                }
            });
        });
    }
};
