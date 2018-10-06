* [user-model](#user-model)
* [generating token for users with jwt simple](#generating-token-for-users-with-jwt-simple)
* [signup controller](#signup-controller)
* [signin controller](#signin-controller)
* [complete controller file](#complete-controller-file)
* [protecting signin route with passport local strategy](#protecting-signin-route-with-passport-local-strategy)
* [protecting routes with passport jwt strategy](#protecting-routes-with-passport-jwt-strategy)

## user model

We are going to assume a very simple user model with just two properties -- email and password and __bcrypt__ module for password hashing. Database of our choice here is __mongodb__ with __mongoose__ as ORM.

```javascript
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});
```

We are hashing password each time a new user is added into out database using __pre__ (save) method provided by mongoose.

```javascript
userSchema.pre('save', function(done) {
    const user = this;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return done(err); }

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) { return done(err); }

            user.password = hash;
            done();
        });
    });
});
```

To compare password when user wants to signin to our application, we create a new method on the user schema called __comparePassword__ which makes use of __bcrypt.compare__ method.

```javascript
userSchema.methods.comparePassword = function(candidatePassword, done) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        return done(err, isMatch);
    });
};
```

Last thing to do is to create a mongoose model of a user and export it.

```javascript
module.exports = mongoose.model('user', userSchema);
```

## generating token for users with jwt simple

Each time that a user either signs in or signs up to our application, we are goint to generate a token for him and send it back in json response. To generate token, we are going to use module __jwt-simple__

```javascript
const jwt = require('jwt-simple');
const secrets = require('../config/secrets');

function generateToken(user) {
    const timestamp = Date.now();
    return jwt.encode({
        iat: timestamp,
        sub: user.id
    }, secrets.tokenSecret);
}
```

Where __secrets.tokenSecret__ is some secret string that we need to provide as an aargument to the __jwt.encode__ method. We need to keep this string stored somewhere because we will also need it in a moment for passport jwt setup.

## signup controller

Using __body-parser__ module to extract data from body of requests, we need to obtain an email and password provided by user that we are going to store in our mongo database. But first, we need to check whethere the provided email address is not already registered in our database (email address should be unique). We are also going to check whether body email and password are present in the body of the request. If either of the mentioned conditions is broken, we are going to reply with __422__ status code and some appropriate message. Otherwise, we genereate a token for user and send it back together with the email address that we got.

```javascript
module.exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const password= req.body.password;

    if (!email || !password) {
        return res.status(422).json({ error: 'Password and Email cannot be empty.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(422).json({ error: 'Email is already in use.' });
    }

    const savedUser = await new User({ email, password }).save();

    res.json({
        token: generateToken(savedUser),
        email
    });
};
```

## signin controller

Sign in controller is going to be pretty simple, all we need to do here is to send a token and email address back to the client. But we want to send this information only to signed in users, therefore we are going to protect this route with passport local strategy a little bit later.

```javascript
module.exports.signin = (req, res, next) => {
    res.json({
        token: generateToken(req.user),
        email: req.user.email
    });
};
```

### complete controller file

```javascript
const jwt = require('jwt-simple');

const User = require('../models/user');
const secrets = require('../config/secrets');

function generateToken(user) {
    const timestamp = Date.now();
    return jwt.encode({
        iat: timestamp,
        sub: user.id
    }, secrets.tokenSecret);
}

module.exports.signin = (req, res, next) => {
    res.json({
        token: generateToken(req.user),
        email: req.user.email
    });
};

module.exports.signup = async (req, res, next) => {
    const email = req.body.email;
    const password= req.body.password;

    if (!email || !password) {
        return res.status(422).json({ error: 'Password and Email cannot be empty.' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(422).json({ error: 'Email is already in use.' });
    }

    const savedUser = await new User({ email, password }).save();

    res.json({
        token: generateToken(savedUser),
        email
    });
};
```

## protecting signin route with passport local strategy

Firts we will import __passport__ and __passport-local__ strategy.

```javascript
const passport = require('passport');
const LocalStrategy = require('passport-local');
```

Passport local strategy expects, by default, username and password but we are using email instead of username, therefore we need to inform passport about this by providing a config object with __usernameField__ property set to email.

__LocalStratgy__ expect this configuration object, and a function that takes 3 arguments -- username (email), password, and a callback that we need to execute once we are done.

What we are going to do here is to search for a user with the email that we have got. If the user doesn't exists, then we simply call __done__ (the above mentioned callback) with __null__ and __false__ arguments, where the first argument is some error that have occured during this process and the second argument is the user object which will be added to __req.user__.

If we have found some user with the email address, then we need to check whether his/her password matches with the password from the request. Here we will use the __comparePassword__ method that we have implemented in the user model and once the result is known, we will call done with appropriate arguments.

```javascript
// create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, async function(email, password, done) {
    // verify this email and password, call done with the user
    // if it is the correct email and password
    // otherwise, call done with false

    try {
        const user = await User.findOne({ email });
        if (!user) { return done(null, false); }

        //compare passwords - is 'password' equal to user.password?
        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false) }

            return done(null, user);
        });
    } catch (err) {
        return done(err);
    }
});

// tell passport to use this strategy
passport.use(localLogin);
```

Now we can make use of this local strategy to protect the signin route with it by running any incomming request to that route throught passport authentication middleware.

```javascript
const authController = require('../controllers/auth');
const passportService = require('../services/passport');
const passport = require('passport');

const requireSignIn = passport.authenticate('local', { session: false });

router.route('/signin')
    .post(requireSignIn, authController.signin);
```

The __session: false__ configuration here means that we don't want to create a session for a user, which is not neccessary in this case when we are using JWT.

## protecting routes with passport jwt strategy

The last missing piece is to set up passport jwt strategy so that we can protect some routes based on the JWT token.

First, we need to create a configuration object where we specify how the token should be extracted from request and the secret string that we have used to create the token. 

Then, we will search for the user based on the id extracted from token and again, call __done__ callback with the appropriate arguments (the same process as in the case of local strategy setup).

```javascript
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async function(payload, done) {
    // see if the user ID in the payload exists in our database
    // if it does. call 'done' with that object
    // otherwise, call done without a user object
    try {
        const user = await User.findById(payload.sub);

        if (user) { return done(null, user); }
        return done(null, false);
    } catch (err) {
        return done(err, false);
    }
});

// tell passport to use this strategy
passport.use(jwtLogin);
```

Then in our routes file, we define the jwt login middleware through which we can run any request for protected routes.

```javascript
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/some-route', requireAuth, (req, res, next) => {...});
```









