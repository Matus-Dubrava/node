const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { get404 } = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRouter = require('./routes/shop');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.error(err);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRouter);

app.use(get404);

// sequelize relationship definitions
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'Matus', email: 'test123@gmail.com' });
        } else {
            return user;
        }
    })
    .then(user => {
        // console.log(user);
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        console.error(err);
    });
