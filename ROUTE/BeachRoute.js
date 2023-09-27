const express = require('express');
const mongoose = require("mongoose");
const BeachModel = require('../MODELS/BeachModel');
const UserModel = require('../MODELS/UserModel');
const CommentModel = require('../MODELS/CommentModel');
const VerifyToken = require('../MIDDLEWARE/VerifyToken');
const BeachImage = require('../MIDDLEWARE/UploadBeachImage')


const router = express.Router();

router.get('/beach', async (req, res) => {
    try {
        const beaches = await BeachModel.find()
            .populate("user", "name surname avatar")
            .populate("comment", "content");
        const totalBeaches = await BeachModel.count();
        res.status(200).send({
            statusCode: 200,
            beaches: beaches,
            totalBeaches: totalBeaches
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error
        })
    }
});

router.post('/beach/create', VerifyToken, BeachImage.single("image"), async (req, res) => {
    const users = await UserModel.findOne({ _id: req.body.user });
    if (!users) {
        return res.status(404).send({
            statusCode: 404,
            message: "No user found"
        });
    }

    const newBeach = new BeachModel({
        name: req.body.name,
        type: req.body.type,
        location: req.body.location,
        level: req.body.level,
        image: req.file.path,
        user: users._id,
    });

    try {
        const beach = await newBeach.save();

        users.beach.push(beach);
        await users.save();

        res.status(201).send({
            statusCode: 201,
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

router.delete('/beach/:id',VerifyToken, async(req, res)=>{
    const {id} = req.params;
    try {
        const beach = await BeachModel.findById(id);
        if(!beach){
            res.status(404).send({
                statusCode: 404,
                message: `Beach with id ${id} not found `
            })
        };
        const beachToDelete = await BeachModel.findByIdAndDelete(id);
        res.status(201).send({
            statusCode: 200,
            message: `Beach with id: ${id} delete successfully`
        })

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error,
        })
    }
})

/*///////////////////////// COMMENTS //////////////////////*/

router.get("/beach/:id/comments", async (req, res) => {
    const { id } = req.params;
    
    try {
        const beachComments = await CommentModel.find({ beach: id }).populate("user", "name surname avatar").populate("beach", "name type location level");
        
        res.status(200).json({
            statusCode: 200,
            comments: beachComments,
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            error,
        });
    }
});

router.get("/comment/:commentsId", async (req, res) => {
    const { commentsId } = req.params;
    try {
        const commentById = await CommentModel.findById(commentsId).populate("beach", "name location image").populate("user", "name surname avatar");
        res.status(200).send({
            statusCode: 200,
            commentById,
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error",
            error,
        })
    }
});

router.post("/beach/:id/comment", VerifyToken, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const beach = await BeachModel.findById(id);

        if (!beach) {
            return res.status(404).json({
                statusCode: 404,
                message: "Beach not found",
            });
        }

        const userId = req.user.id;

        const savedComment = await CommentModel.create({
            user: userId, 
            beach: id, 
            content: content,
        });

        await BeachModel.findByIdAndUpdate(id, { $push: { comment: savedComment._id } });

        res.status(201).send({
            statusCode: 201,
            message: "Comment saved successfully",
            savedComment,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            error,
        });
    }
});



router.delete('/comment/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await CommentModel.findById(id);
        if (!comment) {
            res.status(404).send({
                statusCode: 404,
                message: `Comment with id ${id} not found`,
            })
        }
        const commentToDelete = await CommentModel.findByIdAndDelete(id);
        res.status(201).send({
            statusCode: 200,
            message: `Comment with id: ${id} delete successfully`
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