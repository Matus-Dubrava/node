const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

mongoose.connect('mongodb://localhost:27017/react-test-db', 
    { useNewUrlParser: true }, 
    () => { console.log('Connection to database established.'); }
);

const userSchema = new mongoose.Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    
    console.log('here');

    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) { return next(err); }

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
       if (err) { return callback(err); }

       callback(null, isMatch);
   }); 
};

module.exports = mongoose.model('user', userSchema);