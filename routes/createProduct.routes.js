import { Router } from "express";
import { createElectronicsProducts, createMensProducts, createWomensProducts, updateProduct } from "../controllers/createProduct.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();
router.route("/men").post(
    upload.array("imageUrl", 10),
    createMensProducts
)
router.route("/women").post(
    upload.array("imageUrl", 10),
    createWomensProducts
)
router.route("/electronic").post(
    upload.array("imageUrl", 10),
    createElectronicsProducts
);
router.route('/update').put(
    upload.array("imageUrl", 10),
    updateProduct
)
export default router