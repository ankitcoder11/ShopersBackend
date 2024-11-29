import { ApiError } from "../utiles/ApiError.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { asyncHandler } from "../utiles/asyncHandler.js";
import { Electronics } from "../models/product.model.js";
import { Mens } from './../models/product.model.js';
import { Women } from './../models/product.model.js';

const getElectronicsProducts = asyncHandler(async (req, res) => {
    const products = await Electronics.find()
    if (!products || products.length === 0) {
        return ApiError(res, 404, "No products found");
    }
    return res.status(200).json(
        new ApiResponse(200, products, "Products retrieved successfully")
    );
});
const getMensProducts = asyncHandler(async (req, res) => {
    const products = await Mens.find()
    if (!products || products.length === 0) {
        return ApiError(res, 404, "No products found");
    }
    return res.status(200).json(
        new ApiResponse(200, products, "Products retrieved successfully")
    );
});
const getWomensProducts = asyncHandler(async (req, res) => {
    const products = await Women.find()
    if (!products || products.length === 0) {
        return ApiError(res, 404, "No products found");
    }
    return res.status(200).json(
        new ApiResponse(200, products, "Products retrieved successfully")
    );
});

export { getElectronicsProducts, getMensProducts, getWomensProducts };