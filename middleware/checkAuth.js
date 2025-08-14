import jwt from 'jsonwebtoken'

export let checkLogin =async(req,res,next)=>{
        try {
           const token=req.headers.authorization.split(' ')[1];
           console.log(token)
           await jwt.verify(token,'shruti123')
           next()
        } catch (error) {
            return res.status(500).json({
                ERROR:`ERROR IN THE checkLogin (checkAuth.js) middleware error:${error}`
            })
        }
}