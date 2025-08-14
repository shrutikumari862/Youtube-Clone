import mongoose from 'mongoose'
import { Schema } from 'mongoose'


const videoSchema=new Schema({
     id:{
         type:Schema.Types.ObjectId
        },
     title:{
        type:String,
        required:true,
     },
     description:{
        type:String,
     },
     userID:{
         type:String,
         required:true,
     },
     videoUrl:{
         type:String,
         required:true,
     },
     thumbnailUrl:{
         type:String,
         required:true,
     },
     videoId:{
         type:String,
         required:true,
     },
     thumbnailId:{
         type:String,
         required:true,
     },
     category:{
         type:String,
         required:true,
     },
     tags:[{
         type:String,
         
     }],
     likes:{
         type:Number,
         default:0,
     },
     dislikes:{
         type:Number,
         default:0,
     },
     views:{
         type:Number,
         default:0,
     },
     likedBy:[{
        type:Schema.Types.ObjectId,
        ref:"User"
     }],
     dislikedBy:[{
        type:Schema.Types.ObjectId,
        ref:"User"
     }],
    //  viewedBy:[{
    //     type:Schema.Types.ObjectId,
    //     ref:"User"
    //  }]


},{timestamps:true})


export const Video=mongoose.model("Video",videoSchema)