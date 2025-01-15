import { Router } from "express";
import { addToCart, getCart, increaseQuantity, removeFromCart } from "../controllers/cart.controllers.js";

const router = Router();

router.route("/add").post(addToCart);
router.route("/:userId").get(getCart);
router.route("/updatequantity").post(increaseQuantity);
router.route("/remove").delete(removeFromCart);

export default router;