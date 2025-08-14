import http from 'http'
import {app} from './app.js'
// import dotenv from 'dotenv'
// dotenv.config();

const port=8087
const server=http.createServer(app)
server.listen(port,()=>{
    console.log(`app is running on port ${port}`)
})