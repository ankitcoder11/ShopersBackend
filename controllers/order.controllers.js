import Razorpay from "razorpay";
import crypto from "crypto"
import { ApiError } from "../utiles/ApiError.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { asyncHandler } from "../utiles/asyncHandler.js";
import { Order } from "../models/order.model.js";
import { Electronics, Mens, Women } from "../models/product.model.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
const createOrder = asyncHandler(async (req, res) => {
    const { userId, productId, quantity, price, items, address } = req.body;

    if (!address || !address.street || !address.city) {
        // return res.status(400).json(new ApiError(400, ''));
        return ApiError(res, 400, 'Address is required for order placement');
    }

    try {
        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: price * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        });

        const order = new Order({
            userId,
            items,
            totalAmount: price,
            address,
            paymentStatus: 'Pending',
            razorpayOrderId: razorpayOrder.id,
        });
        await order.save();

        return res.status(200).json(
            new ApiResponse(200, {
                orderId: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
            }, 'Order created successfully')
        );
    } catch (error) {
        console.error('Error creating order:', error);
        return ApiError(res, 500, 'Failed to create order');
    }
});

// Verify Payment
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;

    try {
        // Generate the signature from the payment details
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        // Compare the generated signature with the received one
        if (generatedSignature === razorpay_signature) {
            // Update order status to "Paid"
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'Paid',
            });

            return res.status(200).json(
                new ApiResponse(200, null, 'Payment verification successful')
            );
        } else {
            return ApiError(res, 400, 'Payment verification failed');
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return ApiError(res, 500, 'Failed to verify payment');
    }
});

// Get All Orders
const getUserOrders = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch all orders for the user
        const orders = await Order.find({ userId })
            .populate('userId', 'name email')
            .exec();

        // Define a model map for each product model
        const productModels = {
            'mens': Mens,
            'womens': Women,
            'electronics': Electronics
        };

        // Loop through orders and populate the items dynamically
        for (let order of orders) {
            for (let item of order.items) {
                const model = item.productModel?.toLowerCase();

                if (!model || !productModels[model]) {
                    console.error('Invalid or missing product model:', model);
                    return ApiError(res, 400, 'Invalid product model in order item');
                }

                const ProductModel = productModels[model];

                // Populate the productId for each item 
                try {
                    item.productId = await ProductModel.findById(item.productId);
                } catch (error) {
                    console.error('Error fetching product data:', error);
                    return ApiError(res, 500, 'Failed to fetch product data');
                }
            }
        }

        if (!orders || orders.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, [], 'No orders found for this user')
            );
        }

        return res.status(200).json(
            new ApiResponse(200, orders, 'User orders fetched successfully')
        );
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return ApiError(res, 500, 'Failed to fetch user orders');
    }
});

// Get all users orders for admin
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        // Fetch all orders from the Order collection
        const orders = await Order.find({})
            .populate('userId', 'fullName email')  // Populate user details
            .exec();

        // Define a model map for each product category
        const productModels = {
            'mens': Mens,
            'womens': Women,
            'electronics': Electronics
        };

        // Loop through orders and populate the items dynamically
        for (let order of orders) {
            for (let item of order.items) {
                const model = item.productModel?.toLowerCase();

                if (!model || !productModels[model]) {
                    console.error('Invalid or missing product model:', model);
                    return ApiError(res, 400, 'Invalid product model in order item');
                }

                const ProductModel = productModels[model];

                // Populate the productId for each item 
                try {
                    item.productId = await ProductModel.findById(item.productId);
                } catch (error) {
                    console.error('Error fetching product data:', error);
                    return ApiError(res, 500, 'Failed to fetch product data');
                }
            }
        }

        if (!orders || orders.length === 0) {
            return res.status(200).json(
                new ApiResponse(200, [], 'No orders found')
            );
        }

        // Respond with all orders
        return res.status(200).json(
            new ApiResponse(200, orders, 'All orders fetched successfully')
        );
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return ApiError(res, 500, 'Failed to fetch all orders');
    }
});

// Update Status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { orderId, paymentStatus, orderStatus } = req.body;

    // Validate input
    if (!orderId) {
        return ApiError(res, 400, 'Order ID is required');
    }

    if (!paymentStatus || !['Pending', 'Paid', 'Failed'].includes(paymentStatus)) {
        return ApiError(res, 400, 'Invalid payment status');
    }

    if (!orderStatus || !['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(orderStatus)) {
        return ApiError(res, 400, 'Invalid order status');
    }

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return ApiError(res, 404, 'Order not found');
        }
        order.paymentStatus = paymentStatus;
        order.orderStatus = orderStatus;

        await order.save();

        return res.status(200).json(
            new ApiResponse(200, order, 'Order status updated successfully')
        );
    } catch (error) {
        console.error('Error updating order status:', error);
        return ApiError(res, 500, 'Failed to update order status');
    }
});

export { createOrder, verifyPayment, getUserOrders, getAllOrders, updateOrderStatus };