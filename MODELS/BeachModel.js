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
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }]
},{timestamps: true, strict:true})

module.exports = mongoose.model("Beach", BeachModelSchema, "beaches")