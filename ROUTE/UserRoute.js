const express = require('express');
const mongoose = require("mongoose");
const UserModel = require('../MODELS/UserModel');
const bcrypt = require('bcrypt');
const UserImage = require('../MIDDLEWARE/UploadUserImg');

const router = express.Router();


router.get('/user', async(req, res)=>{
    try {
        const user = await UserModel.find();
        res.status(200).send({
            statusCode : 200,
            user: user
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error
        })
    }
});

router.post('/user/create', UserImage.single("avatar"), async(req, res)=>{

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = new UserModel({
        name : req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        birthday: req.body.birthday,
        avatar: req.file.path,
        type: req.body.type,
    })
    try {
        const user = await newUser.save();
        res.status(201).send({
            statusCode: 201,
            message: "User successfully registered",
            user: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error
        })
    }
});

module.exports = router;