import cloudinary from "cloudinary";
import productModel from "../models/productModel.js";
// Add Product function
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      productStock,
    } = req.body;

    // Handling unchecked image
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // Filtering only uploaded images
    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    // Check if product already exists (case-insensitive)
    const existingProduct = await productModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Product with this name already exists!",
        });
    }

    // Uploading images to Cloudinary and retrieving URLs
    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Creating product data
    const productData = {
      name,
      description,
      category,
      price: Number(price), // Convert price to number
      productStock: Number(productStock), // Convert productStock to number
      subCategory,
      bestseller: bestseller === "true" || bestseller === true, // Convert bestseller to boolean
      sizes: JSON.parse(sizes), // Convert sizes to array
      image: imageUrl,
      date: Date.now(),
    };

    // Save product to MongoDB
    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "New product added!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// List all Product function
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, message: "list", products });
  } catch (error) {
    console.log("Error");
    res.json({ success: false, message: error.message });
  }
};

// Remove Product function
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product deleted!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Single Product info Product function
const singleProductInfo = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Product function
const updateProduct = async (req, res) => {
  try {
    const { productId, name, description, price, productStock } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required!" });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      {
        name,
        price: Number(price),
        productStock: Number(productStock),
        description,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    res.json({
      success: true,
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Bestseller API
const bestSeller = async (req, res) => {
  try {
    const bestSellers = await productModel
      .find({ bestseller: true })
      .sort({ date: -1 });

    if (!bestSellers.length) {
      return res.status(404).json({ message: "No best-seller products found" });
    }

    res.status(200).json(bestSellers);
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Latest collection API
const latestCollection = async (req, res) => {
  try {
    const latestProducts = await productModel.find().sort({ date: -1 });

    if (!latestProducts.length) {
      return res.status(404).json({ message: "No best-seller products found" });
    }

    res.status(200).json(latestProducts);
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

export {
  addProduct,
  removeProduct,
  listProducts,
  singleProductInfo,
  updateProduct,
  bestSeller,
  latestCollection,
};
