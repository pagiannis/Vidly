const express = require('express');
const router = express.Router();
const {Customer,validateCustomer} = require('../models/customer');

router.use(express.json());

router.get('/',async (req,res)=>{
    const customers = await Customer.find().sort({name:1});
    res.send(customers);
});

router.post('/',async(req,res)=>{
    //INPUT VALIDATION
    //using JOI (in joi we need to define a schema. The schema's job is to define how the structure of the object will be)
    const {error} = validateCustomer(req.body);
    
    if(error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    await customer.save();
    res.send(customer);
});

router.put('/:id',async (req,res)=>{
    //Joi validation
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id,{isGold: req.body.isGold},{name: req.body.name},{phone: req.body.phone}, {
        new: true
    })
    if(!customer) return res.status(404).send('The genre with the given ID was not found');
    
    res.send(customer);
});

router.delete('/:id',async (req,res)=>{
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if(!customer){
        res.status(404).send('The genre with the given ID was not found');
        return;
    }

    //Return the same genre
    res.send(customer);
});

router.get('/:id',async (req,res)=>{
    const customer = await Customer.findById(req.params.id);
    
    if(!customer) return res.status(404).send('The genre with the given ID was not found');

    res.send(customer);
});


module.exports = router;