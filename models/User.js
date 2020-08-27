const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Email inválido.'});
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    type: {
        type: String,
        required: true
    },
    defaultAddress: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

userSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this;
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email });
    if (!user) {
        return false;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        return false;
    }

    return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;