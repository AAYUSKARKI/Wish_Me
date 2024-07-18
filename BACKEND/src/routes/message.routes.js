import { Router } from "express";
import { sendmessage, getmessage, getConversations, handleSeen } from "../controllers/message.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/sendmessage/:id").post(verifyJWT,sendmessage)
router.route("/getmessage/:id").get(verifyJWT,getmessage)
// Fetch all conversations/messages for a user
router.route('/myconvo').get(verifyJWT,getConversations)
router.route('/markAsSeen/:conversationId').post(verifyJWT,handleSeen)
  
export default router;