import express from 'express'
import { placeOrder,placeOrderStripe,allOrders,updateStatus,userOrders, verifystripe} from '../controllers/orderConroller.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// order endpoints for Admin
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// endpoints for payment
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)

// endpoints for user orders
orderRouter.post('/userorders',authUser,userOrders)

// verify payments
orderRouter.post('/verifyStripe',authUser,verifystripe)

export default orderRouter