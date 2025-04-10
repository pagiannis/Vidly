const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Genre,validateGenre} = require('../models/genre');

router.use(express.json());

router.get('/',async(req,res)=>{
    const genres = await Genre.find().sort({name:1});
    res.send(genres);
});

router.post('/', auth, async(req,res)=>{
    //INPUT VALIDATION
    //using JOI (in joi we need to define a schema. The schema's job is to define how the structure of the object will be)
    const {error} = validateGenre(req.body);
    
    if(error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name
    });

    await genre.save();
    res.send(genre);
});

router.put('/:id', async (req,res)=>{
    //Joi validation
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id,{name: req.body.name}, {
        new: true
    })
    if(!genre) return res.status(404).send('The genre with the given ID was not found');
    
    res.send(genre);
});

router.delete('/:id',[auth,admin], async (req,res)=>{
    const genre = await Genre.findByIdAndDelete(req.params.id);

    if(!genre){
        res.status(404).send('The genre with the given ID was not found');
        return;
    }

    //Return the same genre
    res.send(genre);
});

router.get('/:id',validateObjectId, async (req,res)=>{
    const genre = await Genre.findById(req.params.id);
    
    if(!genre) return res.status(404).send('The genre with the given ID was not found');

    res.send(genre);
});

module.exports = router;