const express = require('express');
const mongoose = require('mongoose');
const SchoolModel = require('../MODELS/SchoolModel');
const bcrypt = require('bcrypt');
const VerifyToken = require('../MIDDLEWARE/VerifyToken');
const SchoolImage = require('../MIDDLEWARE/UploadSchoolImage');

const router = express.Router();



router.get('/school', async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query;
    try {
        const school = await SchoolModel.find()
            .limit(pageSize)
            .skip((page - 1) * pageSize);
        const totalSchools = await SchoolModel.count();
        res.status(200).send({
            statusCode: 200,
            schools: school,
            totalSchools: totalSchools,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error
        })
    }
})
router.get('/school/location', async (req, res) => {
    const { page = 1, pageSize = 10, location } = req.query;

    try {
        const schools = await SchoolModel.find({ location: location.replace(/_/g, ' ') })
            .limit(pageSize)
            .skip((page - 1) * pageSize);

        const totalSchools = await SchoolModel.count({ location: location.replace(/_/g, ' ') });

        res.status(200).send({
            statusCode: 200,
            schools,
            totalSchools,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error,
        });
    }
});
router.get('/school/:id', async (req, res) => {
    const { id } = req.params; 

    try {
        const schoolById = await SchoolModel.findById(id);

        if (!schoolById) {
            return res.status(404).send({
                statusCode: 404,
                message: "School not found",
            });
        }

        res.status(200).send({
            statusCode: 200,
            school: schoolById, 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            statusCode: 500,
            message: "Internal Server Error",
            error,
        });
    }
});


router.post('/school/create', SchoolImage.single("image"), async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newSchool = new SchoolModel({
        name: req.body.name,
        address: req.body.address,
        location: req.body.location,
        image: req.file.path,
        description: req.body.description,
        email: req.body.email,
        password: hashedPassword,
    })
    try {
        const school = await newSchool.save();
        res.status(201).send({
            statusCode: 201,
            message: "School saved successfully",
            payload: school,
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
})

router.delete('/school/:id', VerifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const school = await SchoolModel.findById(id);
        if (!school) {
            res.status(404).send({
                statusCode: 404,
                message: `School with id ${id} not found`,
            })
        }
        const schoolToDelete = await SchoolModel.findByIdAndDelete(id);
        res.status(201).send({
            statusCode: 200,
            message: `School with id: ${id} delete successfully`
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error,
        })
    }
})

module.exports = router;