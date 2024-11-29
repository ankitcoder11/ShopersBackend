import { Router } from "express";
import { getElectronicsProducts, getMensProducts, getWomensProducts } from "../controllers/getProducts.controllers.js";

const router = Router();
router.route("/get-electronics").get(getElectronicsProducts);
router.route("/get-mens").get(getMensProducts);
router.route("/get-womens").get(getWomensProducts);
export default router