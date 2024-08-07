import { Router } from "express";
import {
    createComment,
    getCommentsForPost,
    getCommentById,
    deleteComment,
    getCommentsByUser
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
  
export default router;