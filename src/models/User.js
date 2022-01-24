
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Task = require('./task');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("invalid Age");
            }
        }
    }
    ,
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim:true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('invalid password hai ye');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type:Buffer,
    }
}, {
    timestamps: true
})
userSchema.virtual( 'tasks',{
    ref: "Task",
    localField:"_id",
    foreignField:"owner"
})
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.findMany({ owner: user._id });
    next();
})
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    //console.log("just before save bro");

    next();
})
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}
userSchema.methods.getAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "helloWorld");
    user.tokens = user.tokens.concat({ token });
   // console.log(user);
    await user.save();
    return token;
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw Error('Unable to Login');
    }

    const isMatch= await bcrypt.compare(password, user.password);
    if (!isMatch){
        throw Error('Unable to Login');
    }
    return user;
}
const User = mongoose.model('User', userSchema);
module.exports = User;