import mongoose from 'mongoose'
import {Schema} from 'mongoose'

const commentSchema=new Schema({
_id:{
    type:mongoose.Schema.Types.ObjectId
},

video_id:{
    type:String,
    required:true
},

commentText:{
    type:String,
    required:true
},

user_id:{
     type:Schema.Types.ObjectId,
     required:true,
     ref:"User"
},
},
{timestamps:true}
)

export const Comment=mongoose.model("Comment",commentSchema)