import http from 'http'
import {app} from './app.js'
import dotenv from 'dotenv'
dotenv.config();


const server=http.createServer(app)
server.listen(process.env.PORT,()=>{
    console.log(`app is running on port ${port}`)
})