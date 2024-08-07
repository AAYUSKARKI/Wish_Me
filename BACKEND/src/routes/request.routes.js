import { Router } from "express";
import {
    createPost,
    getPostById,
    getMyposts,
    deletePost,
    getAllPosts,
    myposts,
    getPostByMyCategory,
    getCommentsForPost
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


router.route("/myrequests").get(verifyJWT, getMyposts);

router.route("/myposts/myposts").get(verifyJWT,getPostByMyCategory);

router.route("/comments/:id").get(getCommentsForPost);

router.route("/posts/requests/myposts").get(verifyJWT,myposts);

export default router;