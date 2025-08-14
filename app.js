import express from 'express'
export const app=express();
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();
import { userRouter } from './routes/user.rout.js';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { videoRoutes } from './routes/video.rout.js';
import { commentRout } from './routes/comment.rout.js';
import cors from 'cors'



const connectWithDB=async()=>{
       try {
        const res=await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("connection with DB SUCCESSFUL!!")
       } catch (error) {
        console.log("error in connecting with DB",error)
       }
}

connectWithDB()


app.use(cors())
app.use(bodyParser.json());
app.use(fileUpload({
       useTempFiles:true,
       // tempFileDir:'/tmp/'
}));


app.use('/user',userRouter)
app.use('/video',videoRoutes)
app.use('/comment',commentRout)