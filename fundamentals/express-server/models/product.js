const fs = require('fs');
const path = require('path');

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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile().then(products => {
            products.push(this);

            fs.writeFile(p, JSON.stringify(products), err => {
                if (err) {
                    console.error(err);
                }
            });
        });
    }

    static fetchAll() {
        return getProductsFromFile();
    }
};
