import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'


// Load environment variables
dotenv.config()



// App config
const app = express()
const port = process.env.PORT || 2400

// Connect to Database and Cloudinary
connectDB()
connectCloudinary()

// Middleware
app.use(express.json())
app.use(cors())

// API Endpoints
app.get('/', (req, res) => {
    res.send("API Working!")
})

// Routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Start Server
app.listen(port, () => console.log(`Server running successfully on port ${port}`))
