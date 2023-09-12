const mongoose = require("mongoose")


const commentModel = new mongoose.Schema({

    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    content : {
        type : String,
        required : true
    },
    beach: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Beach",
      }],
},{timestamps :true, strict :true})

module.exports = mongoose.model("Comment", commentModel, "Comments");