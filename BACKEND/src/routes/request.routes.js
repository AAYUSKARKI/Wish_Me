import { Router } from "express";
import {
    createPost,
    getPostsByCommunity,
    createPostsByCommunity,
    getPostById,
    deletePost,
    getAllPosts
} from "../controllers/request.controller.js";

import {upload} from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/")
    .post(verifyJWT,upload.single("media"), createPost)
    .get(getAllPosts);

router.route("/:id")
    .get(verifyJWT, getPostById)
    .delete(verifyJWT, deletePost);

router.route("/community/:id")
    .post(verifyJWT,upload.single("media"), createPostsByCommunity)
    .get(verifyJWT, getPostsByCommunity);

export default router;