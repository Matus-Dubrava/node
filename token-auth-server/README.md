* [user-model](#user-model)

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

