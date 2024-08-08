import { Router } from "express";
import {
    createComment,
    getCommentsForPost,
    getCommentById,
    deleteComment,
    getCommentsByUser,
    getNotifications
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/")
    .post(verifyJWT, createComment);
router.route("/:id")
    .get(getCommentsForPost)
    .delete(verifyJWT, deleteComment)
    
router.route("/user/:id").get(getCommentsByUser)
router.route("/getcommentbyid/:id").get(getCommentById)

router.route("/abc/cde/notifications").get(verifyJWT, getNotifications)
  
export default router;