import { Router } from "express";
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus, verifyPayment } from "../controllers/order.controllers.js";

const router = Router();

router.route("/create").post(createOrder);
router.route("/verify-payment").post(verifyPayment);
router.route("/get-all-orders/:userId").get(getUserOrders);
router.route("/get-all-users-orders").get(getAllOrders);
router.route("/update-status").put(updateOrderStatus);

export default router;