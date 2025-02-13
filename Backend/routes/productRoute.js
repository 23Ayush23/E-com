import express from "express"
import {addProduct,removeProduct,listProducts,singleProductInfo, updateProduct, bestSeller, latestCollection} from '../controllers/productController.js'
import upload from "../middleware/multer.js"
import adminAuth from "../middleware/adminAuth.js"

const productRouter = express.Router()

// upload middleware for adding multiform data using fields()
productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:2},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct)
productRouter.post('/remove',adminAuth,removeProduct)
productRouter.post('/update',adminAuth,updateProduct)
productRouter.post('/single',singleProductInfo)
productRouter.get('/list',listProducts)
productRouter.get('/bestseller',bestSeller)
productRouter.get('/latest',latestCollection)

export default productRouter
