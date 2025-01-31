import { Router } from "express";
import { addToCart, clearCart, getCart, increaseQuantity, removeFromCart } from "../controllers/cart.controllers.js";
import { verifyJWT } from './../middlewares/auth.middlewares.js';

const router = Router();

router.route("/add").post(verifyJWT, addToCart);
router.route("/:userId").get(verifyJWT, getCart);
router.route("/updatequantity").post(verifyJWT, increaseQuantity);
router.route("/remove").delete(verifyJWT, removeFromCart);
router.route("/clearcart").delete(verifyJWT, clearCart);

export default router;