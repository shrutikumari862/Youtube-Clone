import express from 'express'
export const videoRoutes=express.Router()
import jwt from 'jsonwebtoken'
import { checkLogin } from '../middleware/checkAuth.js'
import cloudinary from 'cloudinary'
import { Video } from '../models/Video.model.js'
import { User } from '../models/User.model.js'
import mongoose from 'mongoose'


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


videoRoutes.get('/own-video',checkLogin,async(req,res)=>{
  try {
    const verifiedUser= await jwt.verify(req.headers.authorization.split(' ')[1],'shruti123');
    console.log(verifiedUser)
    const videos=await Video.find({userID:verifiedUser._id})
    console.log(videos)
    res.status(200).json({
      videos:videos
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ERROR:`ERROR IN GET OWB-VIDEO ROUT ${error}`
    })
  }
})

videoRoutes.post('/upload',checkLogin,async(req,res)=>{
   try {
     const token=req.headers.authorization.split(' ')[1];
     const user=await jwt.verify(token,'shruti123')
     const uploadedVideo=await cloudinary.uploader.upload(req.files.video.tempFilePath)
     const uplaodedThumbnail=await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
     



     const newVideo=new Video({
     id:new mongoose.Types.ObjectId,
     title:req.body.title,
     description:req.body.description,
     userID:user._id,
     videoUrl:uploadedVideo.secure_url,
     thumbnailUrl:uplaodedThumbnail.secure_url,
     videoId:uploadedVideo.public_id,
     thumbnailId:uplaodedThumbnail.public_id,
     category:req.body.category,
     tags:req.body.tags.split(','),
     

     })

   const newUploadedVideoData=await newVideo.save()
   res.status(200).json({
    newVideo:newUploadedVideoData
   })
   } catch (error) {
      res.status(500).json({
        ERROR:`ERROR IN VIDEO ROUTES ${error}`
      })
   }
})







//update video detail



videoRoutes.put('/:videoID',checkLogin,async(req,res)=>{
           try {
            const verifiedUser= await jwt.verify(req.headers.authorization.split(' ')[1],'shruti123');
            const video=await Video.findById(req.params.videoID)
            console.log(video)
            console.log(verifiedUser)
            if(video.userID==verifiedUser._id){
                 console.log("updated")
                 if(req.files){
                 await cloudinary.uploader.destroy(video.thumbnailId)
                 const updatedThumbnail=await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
                 const updatedData={
                  title:req.body.title,
                  description:req.body.description,
                  category:req.body.category,
                  tags:req.body.tags.split(','),
                  thumbnailUrl:updatedThumbnail.secure_url,
                  thumbnailId:updatedThumbnail.public_id,
                 }
                const updatedDetails=await Video.findByIdAndUpdate(req.params.videoID,updatedData)
                res.status(200).json({
                  updatedVideo:updatedDetails
                })
                 }}
            else{
              return res.status(500).json({
                ERROR:`YOUR ARE NOT ELEIGIBLE TO SET UPDATES IN THIS VIDEO`
              })
            }
           } catch (error) {
            console.log(error)
            return res.status(500).json({
               ERROR:`ERROR IN THE EDIT VIDEO [/:videoID] ROUT, ${error}`
            })
           }





})


////delete video rout


videoRoutes.delete('/:videoID',checkLogin,async(req,res)=>{
try {
  const verifiedUser= await jwt.verify(req.headers.authorization.split(' ')[1],'shruti123');
  console.log(verifiedUser)
  const video=await Video.findById(req.params.videoID)
  if(video.userID==verifiedUser._id){

    await cloudinary.uploader.destroy(video.videoId)
    await cloudinary.uploader.destroy(video.thumbnailId)
    const deletedResponse=await Video.findByIdAndDelete(req.params.videoID)


    console.log("you are eligible to dete the video")
    res.status(200).json({
      deletedREsponse:deletedResponse
    })
  }
  else{
    console.log(`you are not elegible to delete the video`)
    res.status(500).json({
    message:"you are not eligible to delete the video"
  })


}} catch (error) {
  console.log(error)
  res.status(500).json({
    ERROR:`ERROR IN DELETE VIDEO ROUT ${error}`
  })
}

})



videoRoutes.put('/like/:videoID',checkLogin,async(req,res)=>{
  try {
    const verifiedUser= await jwt.verify(req.headers.authorization.split(' ')[1],'shruti123');
    console.log(verifiedUser)
    const video=await Video.findById(req.params.videoID)
    console.log(video)
    if(video.likedBy.includes(verifiedUser._id)){
      return res.status(500).json({
        ERROR:`YOU HAVE ALREADY LIKED THIS VIDEO`
      })
    }
    
    if(video.dislikedBy.includes(verifiedUser._id)){
      video.dislikes -=1
      video.dislikedBy.filter(userID=>userID.toString()  != verifiedUser._id)
      
    }


    video.likes +=1
    video.likedBy.push(verifiedUser._id)
    await video.save();
    res.status(200).json({
      message:"liked"
    })
   


  } catch (error) {
    console.log(error)
    res.status(500).json({
      ERROR:`ERROR IN /like/:videoID rout  ${error}`
    })
  }
})




videoRoutes.put('/dislike/:videoID',checkLogin,async(req,res)=>{
  try {
    const verifiedUser= await jwt.verify(req.headers.authorization.split(' ')[1],'shruti123');
    console.log(verifiedUser)
    const video=await Video.findById(req.params.videoID)
    console.log(video)
    if(video.dislikedBy.includes(verifiedUser._id)){
      return res.status(500).json({
        ERROR:`YOU HAVE ALREADY DISLIKED THIS VIDEO`
      })
    }

    if(video.likedBy.includes(verifiedUser._id)){
      video.likes -=1
      video.likedBy.filter(userID=>userID.toString()  != verifiedUser._id)
      
    }
    video.dislikes +=1
    video.dislikedBy.push(verifiedUser._id)
    await video.save();
    res.status(200).json({
      message:"disliked"
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ERROR:`ERROR IN /like/:videoID rout  ${error}`
    })
  }
})




//views


videoRoutes.put('/views/:videoId',async(req,res)=>{
  try {
    const video=await Video.findById(req.params.videoId)
    console.log(video)
    video.views += 1;
    await video.save()
    res.status(200).json({
      msg:`thankyou for viewing`
    })
  } catch (error) {
    console.log(error)
    res.sendStatus(500).json({
      ERROR:`ERROR IN /views/videId rout ERROR:${error}`
    })
  }
  
})