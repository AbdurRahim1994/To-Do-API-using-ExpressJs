const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide first name'],
        trim: true,
        maxLength: [10, 'First name must be up to 10 characters'],
        validate: {
            validator: function (value) {
                return /^[A-Za-z]+$/.test(value)
            },
            message: 'First Name allows only alphabet. It does not allow any number or special character'
        }
    },

    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
        trim: true,
        maxLength: [10, 'Last name must be up to 10 characters'],
        validate: {
            validator: function (value) {
                return /^[A-Za-z]+$/.test(value)
            },
            message: 'Last Name allows only alphabet. It does not allow any number or special character'
        }
    },

    email: {
        type: String,
        required: [true, 'Please provide email'],
        trim: true,
        unique: [true, 'Email Already Exists'],
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
            },
            message: '{VALUE} => invalid email format'
        }
    },

    phone: {
        type: String,
        required: [true, 'Please provide phone number'],
        trim: true,
        unique: [true, 'Mobile number already exists'],
        validate: {
            validator: function (value) {
                return /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/.test(value);
            },
            message: '{VALUE} => Mobile number must be 11 digit and must be start with 01'
        }
    },

    DOB: {
        type: Date,
        default: null
    },

    city: {
        type: String,
        default: 'Dhaka'
    },

    photo: {
        type: Object,
        required: [true, 'Please provide photo'],
        default: {}
    },

    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: [8, 'Password must be at least 8 characters'],
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value);
            },
            message: 'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number'
        }
    },

    userName: {
        type: String,
        required: [true, 'Please provide user name'],
        trim: true,
        minLength: [8, 'User Name must be at lease 8 characters']
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    updatedAt: {
        type: Date,
        default: null
    }
}, { versionKey: false });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
})

const userModel = mongoose.model('users', userSchema);

module.exports = userModel