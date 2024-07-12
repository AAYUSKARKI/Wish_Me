import { Router } from "express";
import { sendmessage, getmessage } from "../controllers/message.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/sendmessage/:id").post(verifyJWT,sendmessage)
router.route("/getmessage/:id").get(verifyJWT,getmessage)

export default router;