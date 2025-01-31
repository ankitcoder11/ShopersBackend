import { Router } from "express";
import { createElectronicsProducts, createMensProducts, createWomensProducts, updateProduct } from "../controllers/createProduct.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyAdmin } from "../middlewares/auth.middlewares.js";
import { verifyJWT } from './../middlewares/auth.middlewares.js';

const router = Router();
router.route("/mens").post(
    verifyJWT,
    verifyAdmin,
    upload.array("imageUrl", 10),
    createMensProducts
)
router.route("/womens").post(
    verifyJWT,
    verifyAdmin,
    upload.array("imageUrl", 10),
    createWomensProducts
)
router.route("/electronics").post(
    verifyJWT,
    verifyAdmin,
    upload.array("imageUrl", 10),
    createElectronicsProducts
);
router.route('/update').put(
    verifyJWT,
    verifyAdmin,
    upload.array("imageUrl", 10),
    updateProduct
)
export default router