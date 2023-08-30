const express = require('express');
const mongoose = require("mongoose");
const BeachModel = require('../MODELS/BeachModel');

const router = express.Router();

router.get('/beach', async(req, res)=>{

    try {
        const beach = await BeachModel.find();
        res.status(200).send({
            statusCode: 200,
            beach: beach,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error
        })
    }
});

router.post('/beach/create', async (req, res) => {
    const newBeach = new BeachModel({
        name: req.body.name,
        type: req.body.type,
        location: req.body.location,
        level: req.body.level,
        image: req.body.image,
    })
    try {
        const beach = await newBeach.save();
        res.status(200).send({
            statusCode: 200,
            message: "Beach saved successfully!",
            payload: beach
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error
        });
    }
});

module.exports = router;