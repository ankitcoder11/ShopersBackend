import { ApiError } from "../utiles/ApiError.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { asyncHandler } from "../utiles/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Electronics, Mens, Women } from './../models/product.model.js';

// Add item to cart
const addToCart = asyncHandler(async (req, res) => {
    const { userId, productId, quantity, mainCategory } = req.body;
    let productModel = mainCategory;
    if (mainCategory.charAt(0) !== mainCategory.charAt(0).toUpperCase()) {
        productModel = mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1).toLowerCase();
    }

    if (!['Mens', 'Womens', 'Electronics'].includes(productModel)) {
        return ApiError(res, 400, "Invalid product model");
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [] });
    }

    const productIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.productModel === productModel);
    if (productIndex > -1) {
        cart.items[productIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, quantity, productModel });
    }

    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Product added to cart")
    );
});

// Get user cart
const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate({
        path: 'items.productId',
        select: 'name price description imageUrl category mainCategory',
    });

    if (!cart) {
        return ApiError(res, 404, "Cart not found");
    }

    // Check if the cart is empty
    if (cart.items.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, { items: [] }, "Cart is empty")
        );
    }

    for (let item of cart.items) {
        if (item.productModel === 'Mens') {
            item.productId = await Mens.findById(item.productId);
        } else if (item.productModel === 'Womens') {
            item.productId = await Women.findById(item.productId);
        } else if (item.productModel === 'Electronics') {
            item.productId = await Electronics.findById(item.productId);
        }
    }

    return res.status(200).json(
        new ApiResponse(200, cart, "Cart retrieved successfully")
    );
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
    const { userId, productId, productModel } = req.body;

    // Validate that productModel is one of the allowed values
    if (!['Mens', 'Womens', 'Electronics'].includes(productModel)) {
        return ApiError(res, 400, "Invalid product model");
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return ApiError(res, 404, "Cart not found");
    }

    // Remove product from cart by matching both productId and productModel
    cart.items = cart.items.filter(item => item.productId.toString() !== productId || item.productModel !== productModel);

    // Save the updated cart
    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Product removed from cart")
    );
});

// update quantity of product
// Increase quantity of a particular item in the cart
const increaseQuantity = asyncHandler(async (req, res) => {
    const { userId, productId, productModel, quantity } = req.body;

    // Validate that productModel is one of the allowed values
    if (!['Mens', 'Womens', 'Electronics'].includes(productModel)) {
        return ApiError(res, 400, "Invalid product model");
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return ApiError(res, 404, "Cart not found");
    }

    // Find the index of the item to update
    const productIndex = cart.items.findIndex(item => item.productId.toString() === productId && item.productModel === productModel);

    if (productIndex > -1) {
        // Increase the quantity of the existing product
        cart.items[productIndex].quantity = quantity;
    } else {
        // If the item doesn't exist in the cart, return an error
        return ApiError(res, 404, "Product not found in cart");
    }

    // Save the updated cart
    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Product quantity updated")
    );
});

//clear the cart
const clearCart = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
        return ApiError(res, 404, "Cart not found");
    }

    // Clear all items from the cart
    cart.items = [];

    // Save the updated cart
    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, cart, "Cart cleared successfully")
    );
});

export { addToCart, getCart, removeFromCart, increaseQuantity,clearCart };