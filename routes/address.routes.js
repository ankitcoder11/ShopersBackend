import { Router } from "express";
import { createAddress, getAddresses } from "../controllers/address.controllers.js";
import { verifyJWT } from './../middlewares/auth.middlewares.js';

const router = Router();
router.route("/create").post(verifyJWT,createAddress)
router.route("/getaddress/:userId").get(verifyJWT,getAddresses)
export default router