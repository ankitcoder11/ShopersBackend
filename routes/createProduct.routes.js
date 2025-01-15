import { Router } from "express";
import { createElectronicsProducts, createMensProducts, createWomensProducts, updateProduct } from "../controllers/createProduct.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();
router.route("/mens").post(
    upload.array("imageUrl", 10),
    createMensProducts
)
router.route("/womens").post(
    upload.array("imageUrl", 10),
    createWomensProducts
)
router.route("/electronics").post(
    upload.array("imageUrl", 10),
    createElectronicsProducts
);
router.route('/update').put(
    upload.array("imageUrl", 10),
    updateProduct
)
export default router