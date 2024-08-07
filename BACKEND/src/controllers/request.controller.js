import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { Post } from "../models/request.model.js";
import { Apiresponse } from "../utils/apiresponse.js";
import { io } from "../index.js";

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
    const posts = await Post.find({ createdBy: req.user._id }).populate("createdBy").sort({ createdAt: -1 });

    if (!posts) {
        throw new Apierror(404, "Posts of mine not found");
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

const getCommentsForPost = asynchandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await Post.findById(postId).populate("comments");
    if (!comments) {
        throw new Apierror(404, "Comments not found");
    }
    return res.status(200).json(new Apiresponse(200, comments, "Comments fetched successfully"));
});

const getPostByMyCategory = asynchandler(async (req, res) => {
    let mycategory = req.user.sellerCategory;
console.log(`typeof mycategory`, typeof mycategory);
    // Check if mycategory exists and is a non-empty string
    if (!mycategory) {
        return res.status(400).json({ error: "Missing or invalid category list" });
    }

    try {
        // Parse the first level of encoding
        mycategory = JSON.parse(mycategory);
        console.log(`typeof mycategory`, typeof mycategory);
        // Check if mycategory is still a string (indicating it needs a second level of parsing)
        if (typeof mycategory === 'string') {
            mycategory = JSON.parse(mycategory);
        }

        // Ensure mycategory is now an array
        if (!Array.isArray(mycategory)) {
            throw new Error("Invalid category format after parsing");
        }
    } catch (error) {
        return res.status(400).json({ error: "Invalid category format" });
    }

    try {
        console.log('mycategory', mycategory)
        const posts = await Post.find({ category: { $in: mycategory } }).populate("createdBy").sort({ createdAt: -1 });



        // Check if posts were found
        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: "No posts found for these categories" });
        }

        // Return posts if found
        return res.status(200).json({
            status: 200,
            data: posts,
            message: "Posts fetched successfully"
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while fetching posts" });
    }
});



export {
    createPost,
    getPostById,
    deletePost,
    getAllPosts,
    getMyposts,
    getCommentsForPost,
    myposts,
    getPostByMyCategory
};