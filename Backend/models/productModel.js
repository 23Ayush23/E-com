import mongoose, { Types } from "mongoose";

const productSchema = new  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },   
    price:{
        type:Number,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    productStock:{
        type:Number,
        required:true,
        default:0
    },
    sizes:{
        type:Array,
        required:true
    },
    bestseller:
    {
        type:Boolean,required: true, default: false
    },
    date:
    {
        type:Number,required:true
    }
})

const productModel = mongoose.models.product ||  mongoose.model("product",productSchema)

export default productModel;