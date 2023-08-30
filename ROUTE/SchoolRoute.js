const express = require('express');
const mongoose = require('mongoose');
const SchoolModel = require('../MODELS/SchoolModel');
const bcrypt = require('bcrypt');
const VerifyToken = require('../MIDDLEWARE/VerifyToken')

const router = express.Router();



router.get('/school', async(req, res)=>{
    try {
        const school = await SchoolModel.find();
        
        res.status(200).send({
            statusCode: 200,
            schools: school,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error
        })
    }
})

router.post('/school/create', VerifyToken, async(req,res)=>{

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newSchool = new SchoolModel({
        name : req.body.name,
        address: req.body.address,
        location: req.body.location,
        image: req.body.image,
        description: req.body.description,
        email: req.body.email, 
        password : hashedPassword,
        rate: req.body.rate
    })
    try {
        const school = await newSchool.save();
        res.status(201).send({
            statusCode: 201,
            message: "Post saved successfully",
            payload: school,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error
        })
    }
})

module.exports = router;