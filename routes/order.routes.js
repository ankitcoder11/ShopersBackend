import { Router } from "express";
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus, verifyPayment } from "../controllers/order.controllers.js";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/create").post(verifyJWT, createOrder);
router.route("/verify-payment").post(verifyJWT, verifyPayment);
router.route("/get-all-orders/:userId").get(verifyJWT, getUserOrders);
router.route("/get-all-users-orders").get(verifyJWT, getAllOrders);
router.route("/update-status").put(verifyJWT, verifyAdmin, updateOrderStatus);

export default router;