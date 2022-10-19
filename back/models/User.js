const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail],
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    bio :{
        type: String,
        max: 1024,
    },
    followers: {
        type: [String]
    },
    following: {
        type: [String]
    },
    likes: {
        type: [String]
    },
    isAdmin: {
        type: Boolean,
        require: true,
        default: false
    }
},
    { timestamps: true }
);

// play function before saving to DB
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        // compare password
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;