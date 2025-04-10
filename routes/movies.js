const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Movie,validateMovie} = require('../models/movie');
const {Genre} = require('../models/genre');

router.use(express.json());

router.get('/',async (req,res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.post('/',auth,async(req,res)=>{
    //INPUT VALIDATION
    //using JOI (in joi we need to define a schema. The schema's job is to define how the structure of the object will be)
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid genre.');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save();
    res.send(movie);
});

router.put('/:id',async (req,res)=>{
    //Joi validation
    const {error} = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genre.genreId);

    const movie = await Movie.findByIdAndUpdate(req.params.id,{title: req.body.title},{genre: genre},{numberInStock: req.body.numberInStock},{dailyRentalRate: req.body.dailyRentalRate}, {
        new: true
    })
    if(!movie) return res.status(404).send('The movie with the given ID was not found');
    
    res.send(movie);
});


router.delete('/:id',async (req,res)=>{
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if(!movie){
        res.status(404).send('The movie with the given ID was not found');
        return;
    }

    //Return the same genre
    res.send(movie);
});


router.get('/:id',async (req,res)=>{
    const movie = await Movie.findById(req.params.id);
    
    if(!movie) return res.status(404).send('The movie with the given ID was not found');

    res.send(movie);
});

module.exports = router;