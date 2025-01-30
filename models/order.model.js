import { mongoose } from 'mongoose';

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    // country: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, refPath: 'items.productModel', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            productModel: { type: String, enum: ['Mens', 'Womens', 'Electronics'], required: true },
        },
    ],
    address: { type: addressSchema, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


export const Order = mongoose.model("Order", orderSchema)