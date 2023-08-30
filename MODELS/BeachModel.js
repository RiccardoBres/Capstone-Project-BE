const mongoose = require('mongoose');

const BeachModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: true
    }
},{timestamps: true, strict:true})

module.exports = mongoose.model("Beach", BeachModelSchema, "beaches")