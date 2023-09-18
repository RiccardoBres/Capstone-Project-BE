const mongoose = require('mongoose')

const SchoolModelScheme = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        require: false,
    },
    description: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
},{timestamps: true, strict:true});

module.exports = mongoose.model('School', SchoolModelScheme, 'schools')