import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { Post } from "../models/request.model.js";
import { Apiresponse } from "../utils/apiresponse.js";
import { io } from "../index.js";
import { json } from "express";

const createPost = asynchandler(async (req, res) => {
    console.log(req.body)
    const {content, createdBy , category } = req.body;

    if (!content || !createdBy) {
        throw new Apierror(400, "All fields are required");
    }
    console.log(req.file)
    const media = req.file? await uploadOnCloudinary(req.file.path) : null;

    const post = new Post({
        content,
        media: media ? media.url : null,
        createdBy,
        category: JSON.parse(category)
    });
        const savedPost = await post.save();

    // Correct method chaining to populate createdBy
    await savedPost.populate('createdBy');

    // Emit the fully populated post
    io.emit("new-post", savedPost);

    return res.status(201).json(new Apiresponse(201, savedPost , "Post created successfully"));
});

const getAllPosts = asynchandler(async (req, res) => {
    const posts = await Post.find().populate("createdBy").sort({ createdAt: -1 });

    return res.status(200).json(new Apiresponse(200, posts, "Posts fetched successfully"));
});

const getPostsByCommunity = asynchandler(async (req, res) => {
    const communityid = req.params.id;

    const find = await Community.findById(communityid)

    if(!find){
        throw new Apierror(400, "Community not found");
    }

    const posts = await Post.find({ community:find._id }).populate("createdBy").sort({ createdAt: -1 });

    return res.status(200).json(new Apiresponse(200, posts, "Posts fetched successfully"));
});

const createPostsByCommunity = asynchandler(async (req, res) => {
    console.log(req.body)
    const {content, createdBy } = req.body;
    const communityid = req.params.id

    const find = await Community.findById(communityid)

    if(!find){
        throw new Apierror(400, "Community not found");
    }

    if (!content || !createdBy) {
        throw new Apierror(400, "All fields are required");
    }
    console.log(req.file)

    const media = req.file? await uploadOnCloudinary(req.file.path) : null;

    const post = new Post({
        content,
        community:find._id,
        media: media ? media.url : null,
        createdBy
    });

        const savedPost = await post.save();

    // Correct method chaining to populate createdBy
    await savedPost.populate('createdBy');

    // Emit the fully populated post
    io.emit("new-post", savedPost);

    return res.status(201).json(new Apiresponse(201, savedPost , "Post created successfully"));
});

const getPostById = asynchandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
        throw new Apierror(404, "Post not found");
    }

    return res.status(200).json(new Apiresponse(200, post, "Post fetched successfully"));
});

const deletePost = asynchandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
        throw new Apierror(404, "Post not found");
    }

    return res.status(200).json(new Apiresponse(200, post, "Post deleted successfully"));
});

const getMyposts = asynchandler(async (req, res) => {
    console.log(req.user)
    console.log(req.user._id)
    console.log('i am here')
    const posts = await Post.find({ createdBy: req.user._id }).populate("createdBy").sort({ createdAt: -1 });

    if (!posts) {
        throw new Apierror(404, "Posts not found");
    }
    return res.status(200).json(new Apiresponse(200, posts, "Posts fetched successfully"));
});

const myposts = asynchandler(async (req, res) => {
    const posts = await Post.find({ createdBy: req.user._id }).populate("createdBy").sort({ createdAt: -1 });

    if (!posts) {
        throw new Apierror(404, "Posts not found");
    }

    return res.status(200).json(new Apiresponse(200, posts, "Posts fetched successfully"));

});
export {
    createPost,
    getPostsByCommunity,
    getPostById,
    deletePost,
    getAllPosts,
    createPostsByCommunity,
    getMyposts,
    myposts
};