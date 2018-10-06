const jwt = require('jwt-simple');

const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
} 

module.exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).json({ error: 'You must provide both email and password' });
    }

    try {
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(422).json({ error: 'Email is in use' });
        }

        const newUser = await (new User({ email, password }).save());
        res.json({ token: tokenForUser(newUser) });
    } catch (err) {
        return next(err);
    }
};

module.exports.signin = (req, res) => {
    // user has already had their email and password auth'd
    // we just need to give them a token
    res.json({ token: tokenForUser(req.user) });
};
