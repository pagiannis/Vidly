const mongoose = require('mongoose');
const Joi = require('joi');  //joi is a data validation package


const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre',genreSchema);

function validateGenre(genre){
    //Validate
    //If invalid return 400 - Bad request
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    });

    return schema.validate(genre);
}

module.exports = {Genre,validateGenre,genreSchema};