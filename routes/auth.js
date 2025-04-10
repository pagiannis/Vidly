const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

router.use(express.json());

router.post('/', async (req,res) => {
    const {error} = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
});

function validateAuth(req){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: passwordComplexity().required()
    });

    return schema.validate(req);
}

module.exports = router;