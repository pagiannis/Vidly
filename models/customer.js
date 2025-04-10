const mongoose = require('mongoose');
const Joi = require('joi');  //joi is a data validation package

const Customer = mongoose.model('Customer',new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false,
        required: true,
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

function validateCustomer(customer){
    //Validate
    //If invalid return 400 - Bad request
    const schema = Joi.object({
        isGold: Joi.boolean(),
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required()
    });

    return schema,validate(customer);
}

module.exports = {Customer,validateCustomer}