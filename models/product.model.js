import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        lowercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: [String]
    },
    category: {
        type: String,
        required: true
    },
    mainCategory: {
        type: String,
        required: true
    }
}, { timestamps: true })
export const Mens = mongoose.model("Men", productSchema)
export const Women = mongoose.model("Women", productSchema)
export const Electronics = mongoose.model("Electronics", productSchema)