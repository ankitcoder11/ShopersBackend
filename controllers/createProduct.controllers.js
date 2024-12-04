import { asyncHandler } from "../utiles/asyncHandler.js";
import { ApiError } from "../utiles/ApiError.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { Electronics, Mens, Women } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utiles/Cloudinary.js";
const createMensProducts = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, mainCategory } = req.body;
    if ([name, price, stock, category, mainCategory].some(item => item?.trim() === "")) {
        return ApiError(res, 400, "All fields are required")
    }
    const imageUrls = [];
    for (const file of req.files) {
        const imageLocalPath = file.path;
        const imageUrl = await uploadOnCloudinary(imageLocalPath);
        imageUrls.push(imageUrl.url);
    }
    const product = await Mens.create({
        name,
        description,
        price,
        stock,
        imageUrl: imageUrls,
        category,
        mainCategory
    })
    if (!product) {
        return ApiError(res, 500, "Something went wrong while creating the product")
    }
    return res.status(201).json(
        new ApiResponse(200, product, "Product created successfully")
    )
});
const createWomensProducts = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, mainCategory } = req.body;
    if ([name, price, stock, category, mainCategory].some(item => item?.trim() === "")) {
        return ApiError(res, 400, "All fields are required")
    }
    const imageUrls = [];
    for (const file of req.files) {
        const imageLocalPath = file.path;
        const imageUrl = await uploadOnCloudinary(imageLocalPath);
        console.log(imageUrl);
        imageUrls.push(imageUrl.url);
    }
    const product = await Women.create({
        name,
        description,
        price,
        stock,
        imageUrl: imageUrls,
        category,
        mainCategory
    })
    if (!product) {
        return ApiError(res, 500, "Something went wrong while creating the product")
    }
    return res.status(201).json(
        new ApiResponse(200, product, "Product created successfully")
    )
});
const createElectronicsProducts = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category, mainCategory } = req.body;
    if ([name, price, stock, category, mainCategory].some(item => item?.trim() === "")) {
        return ApiError(res, 400, "All fields are required")
    }
    const imageUrls = [];
    for (const file of req.files) {
        try {
            const imageLocalPath = file.path;
            const imageUrl = await uploadOnCloudinary(imageLocalPath);
            if (!imageUrl || !imageUrl.url) {
                throw new Error("Invalid image upload response");
            }
            imageUrls.push(imageUrl.url);
        } catch (error) {
            console.error("Error uploading file:", error.message);
            return ApiError(res, 500, "Failed to upload image");
        }
    }
    const product = await Electronics.create({
        name,
        description,
        price,
        stock,
        imageUrl: imageUrls,
        category,
        mainCategory
    })
    if (!product) {
        return ApiError(res, 500, "Something went wrong while creating the product")
    }
    return res.status(201).json(
        new ApiResponse(200, product, "Product created successfully")
    )
});
const updateProduct = asyncHandler(async (req, res) => {
    const { id, name, description, price, stock, category, mainCategory } = req.body;
    if (!id) {
        return ApiError(res, 400, "Product ID is required");
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (stock) updateData.stock = stock;
    if (category) updateData.category = category;
    if (mainCategory) updateData.mainCategory = mainCategory;
    if (req.files && req.files.length > 0) {
        const imageUrls = [];
        for (const file of req.files) {
            try {
                const imageLocalPath = file.path;
                const imageUrl = await uploadOnCloudinary(imageLocalPath);
                if (!imageUrl || !imageUrl.url) {
                    throw new Error("Invalid image upload response");
                }
                imageUrls.push(imageUrl.url);
            } catch (error) {
                console.error("Error uploading file:", error.message);
                return ApiError(res, 500, "Failed to upload image");
            }
        }
        updateData.imageUrl = imageUrls;
    }
    let Model;
    switch (mainCategory?.toLowerCase()) {
        case "mens":
            Model = Mens;
            break;
        case "womens":
            Model = Women;
            break;
        case "electronics":
            Model = Electronics;
            break;
        default:
            return ApiError(res, 400, "Invalid main category");
    }
    try {
        const product = await Model.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            return ApiError(res, 404, "Product not found");
        }
        return res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
    } catch (error) {
        console.error("Error updating product:", error.message);
        return ApiError(res, 500, "Internal server error");
    }
});

export { createMensProducts, createWomensProducts, createElectronicsProducts, updateProduct };