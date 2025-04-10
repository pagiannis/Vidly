const express = require('express');
const router = express.Router();
const {Rental,validateRental} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const mongoose = require('mongoose');

router.use(express.json());

router.get('/', async (req,res) =>{
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/',async (req,res) => {
    const {error} = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer. ');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie. ');

    if (movie.numberInStock == 0) return res.status(400).send('Movie not in stock. ');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    
    //we want to save the rental AND the movie (only if the one completes then the other completes as well).We do this using transactions
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        // Before saving rental
        console.log('Attempting to save rental...');
        await rental.save({ session })
            .then(() => console.log('Rental saved successfully!'))
            .catch(err => console.log('Error saving rental:', err));


        console.log('Updating movie stock...');
        await Movie.findByIdAndUpdate({_id:movie._id}, {
            $inc: { numberInStock: -1}
        },{session});
        await session.commitTransaction();
    
        res.send(rental);
    }
    catch(err){
        await session.abortTransaction();
        res.status(500).send('Something failed.');
    }
    finally{
        session.endSession();
    }
});

module.exports = router;