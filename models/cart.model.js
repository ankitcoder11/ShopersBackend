import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'productModel',  // Dynamic population based on productModel
    },
    quantity: {
        type: Number,
        required: true,
    },
    productModel: {
        type: String,
        required: true,
        enum: ['Mens', 'Womens', 'Electronics'],
    },
});


const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: [cartItemSchema]
});

// const Cart = mongoose.model('Cart', cartSchema);

// export default Cart;
export const Cart = mongoose.model("Cart", cartSchema)