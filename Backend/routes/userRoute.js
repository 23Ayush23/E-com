import express from "express"
import { loginUser,registerUser,adminLogin, forgotPassword, resetPassword, getUserData } from "../controllers/userController.js"
import subscribe from "../controllers/subscribe.js";
import checkSubscription from "../controllers/checkSubscription.js";

const userRouter = express();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/reset-password',resetPassword)
userRouter.post('/subscribe',subscribe)
userRouter.post('/check-subscription',checkSubscription)
userRouter.get('/getuserdata',getUserData)

export default userRouter