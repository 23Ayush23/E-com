import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()


const adminAuth = async (req,res,next) =>{
    try {
        
        const { token } = req.headers
        
        
        if(!token)
        {
          return  res.json({success:false,message:"Please Login Again! Unauthorized User"})
        }
        
        // Cheking token with admin token (email+password)
        const decoded_token = jwt.verify(token,process.env.JWT_SECRET)
        
        if(decoded_token !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD)
            {
             return   res.json({success:false,message:"Please Login Again! Unauthorized User !!!"})
            }
            next()

    } catch (error) {
        console.log(error);
        res.json({success:false,message:message.error}) 
    }
}

export default adminAuth