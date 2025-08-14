import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema= new Schema(
    {
      _id:{
        type:Schema.Types.ObjectId,
      },
      channelName:{
        type:String,
        required:true,
      },
      email:{
        type:String,
        required:true
      },
      phone:{
        type:String,
        required:true
      },
      password:{
        type:String,
        required:true
      },
      logoUrl:{
        type:String,
        required:true
      },
      logoID:{
        type:String,
        required:true
      },
      subscribers:{
        type:Number,
        default:0,
      },
      subscribedBy:[{
        type:Schema.Types.ObjectId,
        ref:"User"
      }],
      subscribedChannels:[{
        type:Schema.Types.ObjectId,
        ref:"User"
      }]

    },
    {
        timestamps:true
    }
)


export const User=mongoose.model("User",userSchema)