const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
});

// Cant reduce methods?
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = (candidatePassword) => {
    console.log()
    if (this.password != null) {
        return bcrypt.compareSync(candidatePassword, this.password);
    } else {
        console.log('this password:' + this.password);
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);
