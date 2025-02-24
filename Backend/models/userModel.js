import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,required:true
    },
    email:{
        type:String,required:true,unique:true
    },
    password:{
        type:String,required:true
    },
    cartData:{
        type:Object,default:{}
    },
},
{minimize: false,
toJSON: { virtuals: true, transform: (doc, ret) => {
    if (Object.keys(ret.cartData).length === 0) {
        delete ret.cartData;  
    }
    return ret;
}},
toObject: { virtuals: true }})

const userModel = mongoose.models.user || mongoose.model("user",userSchema)

export default userModel