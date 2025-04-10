const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    email:{
        type: String,
        required: true,
        min: 5,
        max: 255,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: 5,
        max: 1024
    },
    isAdmin: {
        type: Boolean
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User',userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: passwordComplexity().required()
    });

    return schema.validate(user);
}

module.exports = {User,validateUser};