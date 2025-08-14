import express from 'express'
export const userRouter=express.Router();
import bcrypt from 'bcrypt'
import cloudinary from 'cloudinary'
import dotenv from'dotenv'
dotenv.config();
import mongoose from 'mongoose';
import { User } from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import  JsonWebToken from 'jsonwebtoken';
import { checkLogin } from '../middleware/checkAuth.js';




cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})




userRouter.post('/signUp',async(req,res)=>{
    try {

        const users=await User.find({email:req.body.email})
        if(users.length>0){
            return res.status(500).json({
                ERROR: 'EMAIL ALREADY REGISTERED'
            })
        }
        
       const hashCode=await bcrypt.hash(req.body.password,10)
       const uploadedImage=await cloudinary.uploader.upload(req.files.logo.tempFilePath)
       
       const newUser=new User({
                _id:new mongoose.Types.ObjectId,
                channelName:req.body.channelName,
                email:req.body.email,
                phone:req.body.phone,
                password:hashCode,
                logoUrl:uploadedImage.secure_url,
                logoID:uploadedImage.public_id
       })

       const user=await newUser.save()
       res.status(200).json({
        newUser:user
       })
    } catch (error) {
        res.status(500).json({
            ERROR:error
        })
        
    }
    
    
})


userRouter.post('/login',async(req,res)=>{
    
    try {
        console.log(req.body)
        let users=await User.find({email:req.body.email})
       
        if(users.length==0)
        {
            return res.status(500).json({
                ERROR:"THIS USER IS NOT REGISTERED"
            })
        }
        const isValid=await bcrypt.compare(req.body.password,users[0].password)
        if(!isValid){
            res.status(500).json({
                          Error:"you entered the wrong password"
            })
        }
        const token=JsonWebToken.sign({
            _id:users[0].id,
            channelName:users[0].channelName,
            email:users[0].email,
            phone:users[0].phone,
            logoID:users[0].logoID,
        },'shruti123',
    {expiresIn:'365d'})
    res.status(200).json({
         _id:users[0].id,
            channelName:users[0].channelName,
            email:users[0].email,
            phone:users[0].phone,
            logoID:users[0].logoID,
            logoUrl:users[0].logoUrl,
            token:token,
            subscribers:users[0].subscribers,
            subscribedChannels:users[0].subscribedChannels
    })
        
        
        } 
    catch (error) {
        res.status(500).json({
            ERROR:`error in login ${error}`
        })
    }
})




//subscribe api
//b is to besubscribed
//a is subscribing
userRouter.put('/subscribe/:userBId',checkLogin,async(req,res)=>{
    try{const userA=await jwt.verify(req.headers.authorization.split(' ')[1],'shruti123')
    console.log(userA)
    const userB=await User.findById(req.params.userBId)
    console.log(`to be subscribed ${userB}`)
    if(userB.subscribedBy.includes(userA._id)){
        return res.status(500).json({
            ERROR:"YOU HAVE ALREADY SUBSCRIBED THIS CHANNEL"
        })
    
    }
    userB.subscribers +=1
    userB.subscribedBy.push(userA._id)
    await userB.save()

    const userAfullinformation=await User.findById(userA._id)
    userAfullinformation.subscribedChannels.push(userB._id)
    await userAfullinformation.save()
    res.status(200).json({
        message:"subscribed"
    })
}catch (error){
    return res.status(500).json({
        ERROR:`ERROR IN /subscribe/:userBId  rout ${error}`
    })
}
})

///unsubscribe

userRouter.put('/unsubscribe/:userBId',checkLogin,async(req,res)=>{
    try{const userA=await jwt.verify(req.headers.authorization.split(' ')[1],'shruti123')
    console.log(userA)
    const userB=await User.findById(req.params.userBId)
    console.log(`to be subscribed ${userB}`)
    // if(!userB.subscribedBy.includes(userA._id)){
    //     return res.status(500).json({
    //         ERROR:"YOU HAVE NOT SUBSCRIBED THIS CHANNEL SO YOU CANNOT UNSUBSCRIBE"
    //     })
    
    // }
    if(userB.subscribedBy.includes(userA._id)){
    userB.subscribers -=1
    userB.subscribedBy=userB.subscribedBy.filter(userId=>userId.toString() != userA._id)
    await userB.save()

    const userAfullinformation=await User.findById(userA._id)
    userAfullinformation.subscribedChannels=userAfullinformation.subscribedChannels.filter(userId=>userId != userB._id)
    
    await userAfullinformation.save()
    }
    else{
        res.status(500).json({
            Error:"you have not subscribed the channel"
        })
    }


    res.status(200).json({
        message:"unsubscribed"
    })
}catch (error){
    return res.status(500).json({
        ERROR:`ERROR IN /unsubscribe/:userBId  rout ${error}`
    })
}
})