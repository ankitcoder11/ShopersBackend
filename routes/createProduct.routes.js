import { Router } from "express";
import { createElectronicsProducts, createMensProducts, createWomensProducts } from "../controllers/createProduct.controllers.js";
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
export default router