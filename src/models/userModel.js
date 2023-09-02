const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { defaultImagePath } = require('../secret');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minLength: [3, 'The minimum length of username can be 3 characters'],
        maxLength: [31, 'The maximum length of username can be 31 characters']
    },
    email: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (v) => {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
            },
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minLength: [8, 'The minimum length of username can be 8 characters'],
        set: (value) => bcrypt.hashSync(value, bcrypt.genSaltSync(10))
    },
    image: {
        type: String,
        default: defaultImagePath
    },
    address: {
        type: String,
        required: [true, 'User address is required'],
    },
    phone: {
        type: String,
        required: [true, 'User Phone is required'],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBan: {
        type: Boolean,
        default: false,
    }
}, { timestamps : true})

const User = mongoose.model('Users', userSchema);

module.exports = User;