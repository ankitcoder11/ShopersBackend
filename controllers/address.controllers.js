import mongoose from 'mongoose';
import { Address } from '../models/address.model.js';
import { asyncHandler } from '../utiles/asyncHandler.js';
import { ApiResponse } from '../utiles/ApiResponse.js';
import { ApiError } from '../utiles/ApiError.js';

// Create a new address
export const createAddress = asyncHandler(async (req, res) => {
    const { userId, fullName, phone, street, city, state, zipCode, isDefault, email } = req.body;

    const existingAddresses = await Address.find({ userId });

    let finalIsDefault = isDefault;

    if (existingAddresses.length === 0) {
        finalIsDefault = true;
    } else if (isDefault) {
        await Address.updateMany(
            { userId, isDefault: true },
            { $set: { isDefault: false } }
        );
    }

    const newAddress = new Address({
        userId, fullName, phone, email, street,
        city, state, zipCode, isDefault: finalIsDefault
    });

    // Save the address to the database
    const address = await newAddress.save();
    if (!address) {
        return ApiError(res, 500, "Error creating address")
    }
    return res.status(201).json(
        new ApiResponse(200, address, "Address created successfully")
    )
});

// Get all addresses for a user
export const getAddresses = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const addresses = await Address.find({ userId });

    if (!addresses || addresses.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No addresses found")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, addresses, "Addresses retrieved successfully")
    )
});

// Get a single address by ID
export const getAddressById = async (req, res) => {
    try {
        const addressId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            return res.status(400).json({ message: 'Invalid address ID' });
        }

        const address = await Address.findById(addressId);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({
            message: 'Address retrieved successfully',
            data: address
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching address',
            error: error.message
        });
    }
};

// Update an existing address
export const updateAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const { fullName, phone, street, city, state, zipCode, isDefault } = req.body;

        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            return res.status(400).json({ message: 'Invalid address ID' });
        }

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            { fullName, phone, street, city, state, zipCode, isDefault },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({
            message: 'Address updated successfully',
            data: updatedAddress
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating address',
            error: error.message
        });
    }
};

// Delete an address
export const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            return res.status(400).json({ message: 'Invalid address ID' });
        }

        const deletedAddress = await Address.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({
            message: 'Address deleted successfully',
            data: deletedAddress
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting address',
            error: error.message
        });
    }
};