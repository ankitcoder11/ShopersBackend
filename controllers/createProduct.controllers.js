import { asyncHandler } from "../utiles/asyncHandler.js";
import { ApiError } from "../utiles/ApiError.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { Electronics, Mens, Women } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utiles/Cloudinary.js";
const createMensProducts = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    if ([name, price, stock, category].some(item => item?.trim() === "")) {
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
        category
    })
    if (!product) {
        return ApiError(res, 500, "Something went wrong while creating the product")
    }
    return res.status(201).json(
        new ApiResponse(200, product, "Product created successfully")
    )
});
const createWomensProducts = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    if ([name, price, stock, category].some(item => item?.trim() === "")) {
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
        category
    })
    if (!product) {
        return ApiError(res, 500, "Something went wrong while creating the product")
    }
    return res.status(201).json(
        new ApiResponse(200, product, "Product created successfully")
    )
});
const createElectronicsProducts = asyncHandler(async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    if ([name, price, stock, category].some(item => item?.trim() === "")) {
        return ApiError(res, 400, "All fields are required")
    }
    const imageUrls = [];
    for (const file of req.files) {
        const imageLocalPath = file.path;
        const imageUrl = await uploadOnCloudinary(imageLocalPath);
        imageUrls.push(imageUrl.url);
    }
    const product = await Electronics.create({
        name,
        description,
        price,
        stock,
        imageUrl: imageUrls,
        category
    })
    if (!product) {
        return ApiError(res, 500, "Something went wrong while creating the product")
    }
    return res.status(201).json(
        new ApiResponse(200, product, "Product created successfully")
    )
});
export { createMensProducts, createWomensProducts, createElectronicsProducts };