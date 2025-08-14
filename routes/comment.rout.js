import express from 'express'
export const commentRout=express.Router()
import { Comment } from '../models/Comment.model.js'
import { checkLogin } from '../middleware/checkAuth.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Schema } from 'mongoose'
import { User } from '../models/User.model.js'

commentRout.post('/comment/:video_id',checkLogin,async(req,res)=>{
    try {
        const verifiedUser= await jwt.verify(req.headers.authorization.split(' ')[1],'shruti123');
        console.log(verifiedUser)
        const newComment= new Comment({
            _id:new mongoose.Types.ObjectId,
            video_id:req.params.video_id,
            user_id:verifiedUser._id,
            commentText:req.body.commentText
        })

        const comment=await newComment.save()
        res.status(200).json({
            newComment:comment
        })
         


    } catch (error) {
        res.status(500).json({
            ERROR:`ERROR IN /comment rout error:${error}`
        })
    }
}
)


//find all comments of one video together

commentRout.get('/:videoId',async(req,res)=>{
    try {
        const comments=await Comment.find({video_id:req.params.videoId}).populate("user_id","channelName logoUrl")
        res.status(200).json({
            comments:comments,
        })
    } catch (error) {
        res.status(500).json({
            ERROR:`ERROR IN COMMNET   (/:videoId) ROUT  ERROR:${error}`
        })
    }
})
///update comment

commentRout.put("/:commentId",checkLogin,async(req,res)=>{
   try {
     const verifiedUser= await jwt.verify(req.headers.authorization.split(' ')[1],'shruti123');
     console.log(verifiedUser)
     const comment=await Comment.findById(req.params.commentId)
     console.log(comment)
     if(comment.user_id != verifiedUser._id){
        res.status(500).json({
            message:"you dont have write to edit this comment"
        })
     }
    comment.commentText=req.body.commentText;
     const updatedComment=await comment.save()
     res.status(200).json({
        updatedComment:updatedComment
     })
   } catch (error) {
    res.status(500).json({
        ERROR:`ERROR IN /:commentId  update rout error:${error}`
    })
   }
    
})


//detete comment


commentRout.delete("/:commentId",checkLogin,async(req,res)=>{
   try {
     const verifiedUser= await jwt.verify(req.headers.authorization.split(' ')[1],'shruti123');
     console.log(verifiedUser)
     const comment=await Comment.findById(req.params.commentId)
     console.log(comment)
     if(comment.user_id != verifiedUser._id){
        res.status(500).json({
            message:"you dont have write to delete this comment"
        })
     }
    const deleteddata=await Comment.findByIdAndDelete(req.params.commentId)
     
     res.status(200).json({
        deletedComment:deleteddata
     })
   } catch (error) {
    res.status(500).json({
        ERROR:`ERROR IN /:commentId  update rout error:${error}`
    })
   }
    
})
