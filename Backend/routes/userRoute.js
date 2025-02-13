import express from "express"
import { loginUser,registerUser,adminLogin, forgotPassword, resetPassword } from "../controllers/userController.js"
import subscribe from "../controllers/subscribe.js";

const userRouter = express();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/reset-password',resetPassword)
userRouter.post('/subscribe',subscribe)

export default userRouter