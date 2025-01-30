import { Router } from "express";
import { createAddress, getAddresses } from "../controllers/address.controllers.js";

const router = Router();
router.route("/create").post(createAddress)
router.route("/getaddress/:userId").get(getAddresses)
export default router