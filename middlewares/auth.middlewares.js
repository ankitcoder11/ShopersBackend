import { User } from "../models/user.model.js";
import { ApiError } from "../utiles/ApiError.js";
import { asyncHandler } from "../utiles/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            return ApiError(res, 401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            return ApiError(res, 401, "Invalid Access Token")
        }
        req.user = user;
        next()
    } catch (error) {
        return ApiError(res, 401, error?.message || "Invalid access token")
    }
})