const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true,
    },
    surname : {
        type: String,
        required : true,
    },
    email : {
        type: String,
        required : true,
        unique: true,
    },
    password : {
        type: String,
        required : true,
    },
    birthday : {
        type : String,
        required: false,
    },
    avatar : {
        type: String,
        required: false,
    },
    beach: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beach",
    }]


},{timestamps: true, strict:true})

module.exports = mongoose.model("User", UserSchema, "users");