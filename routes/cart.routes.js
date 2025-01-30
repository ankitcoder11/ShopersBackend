import { Router } from "express";
import { addToCart, clearCart, getCart, increaseQuantity, removeFromCart } from "../controllers/cart.controllers.js";

const router = Router();

router.route("/add").post(addToCart);
router.route("/:userId").get(getCart);
router.route("/updatequantity").post(increaseQuantity);
router.route("/remove").delete(removeFromCart);
router.route("/clearcart").delete(clearCart);

export default router;