// functions for 
// addProduct,
// removeProduct,
// listProducts,
// SingleProduct info

import cloudinary from 'cloudinary'
import productModel from '../models/productModel.js';
// Add Product function
const addProduct = async (req,res) => {
    
    try {
       
        const {name,description,price,category,subCategory,sizes,bestseller} = req.body;
        // Handling uncheked image
            // req.file.image1 if field is available then add image at first index
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        // filtering uploaded images only in images array
        const images = [image1,image2,image3,image4].filter((item)=> item !== undefined) 

        // uploading on cloudinary / Getting imageurl in imageUrl array

        const existingProduct = await productModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

        if (existingProduct) {
            return res.status(400).json({ success: false, message: "Product with this name already exists!" });
        }


        let imageUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )


        // Saving Data in mongodb
        const productData ={
            name,description,category,
            // in form-data price will be in text format have to change in number
            price: Number(price),subCategory,
            // in form data bestseller will be in  text shoild be in boolean type
            bestseller: bestseller === "true" ? true :  false,
            sizes: JSON.parse(sizes),
            image: imageUrl,
            date: Date.now()
        }

        // console.log(productData);
        
        const product = new productModel(productData)
        await product.save() // saving in mongoDB



        // console.log(name,description,price,category,subCategory,sizes,bestseller);
        // console.log(images);
        // console.log(imageUrl);
        
        res.json({success:true,message:"New Product added!"})
        

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})  
    }
}

// List all Product function
const listProducts = async (req,res) => {
    
    try {
        
        const products = await productModel.find({});
        res.json({success:true,message:"list",products})


    } catch (error) {
        console.log("Error");
        res.json({success:false,message:error.message})
        
    }
}

// Remove Product function
const removeProduct = async (req,res) => {
    
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product deleted!"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Single Product info Product function
const singleProductInfo = async (req,res) => {
    
    try {
    
        const { productId } =req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// update product
// Update Product function
const updateProduct = async (req, res) => {
    try {
        const { productId, name, price } = req.body;

        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required!" });
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            { name, price: Number(price) },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        res.json({ success: true, message: "Product updated successfully!", product: updatedProduct });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Bestseller API
const bestSeller = async (req,res) => {
    try {
        const bestSellers = await productModel.find({ bestseller: true }).sort({date: -1});
    
        if (!bestSellers.length) {
          return res.status(404).json({ message: "No best-seller products found" });
        }
    
        res.status(200).json(bestSellers);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        res.status(500).json({ message: "Server error, please try again later" });
      }
}

// Latest collection API
const latestCollection = async (req,res) => {
    try {
        const latestProducts = await productModel.find().sort({date: -1});
    
        if (!latestProducts.length) {
          return res.status(404).json({ message: "No best-seller products found" });
        }
    
        res.status(200).json(latestProducts);
      } catch (error) {
        console.error("Error fetching best sellers:", error);
        res.status(500).json({ message: "Server error, please try again later" });
      }
}

export { addProduct, removeProduct, listProducts, singleProductInfo, updateProduct,bestSeller,latestCollection };

