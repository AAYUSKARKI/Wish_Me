import { asynchandler } from "../utils/asynchandler.js";
import { Apierror } from "../utils/apierror.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/request.model.js";
import { Apiresponse } from "../utils/apiresponse.js";
import { io } from "../index.js";

// Create a comment
const createComment = asynchandler(async (req, res) => {
    const { text, postId, createdBy, parentComment, mentions } = req.body;
console.log(req.body)
    if (!text || !postId || !createdBy) {
        throw new Apierror(400, "All fields are required");
    }

    const comment = new Comment({
        text,
        post: postId,
        createdBy,
        parentComment,
        mentions
    });

    const savedComment = await comment.save();

    // Add comment to post
    await Post.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } });

    // If it's a reply, add to the parent comment's replies
    if (parentComment) {
        console.log(parentComment)
        await Comment.findByIdAndUpdate(parentComment, { $push: { replies: savedComment._id } });
    }

    // Populate the saved comment
    const populatedComment = await Comment.findById(savedComment._id)
        .populate('createdBy')
        .populate('mentions');

    // Emit the fully populated comment
    io.emit("new-comment", populatedComment);

    if(parentComment){
        const populstereply = await Comment.findById(parentComment)
        .populate('createdBy')
        .populate('mentions');
        io.emit("new-reply", populstereply);
    }

    return res.status(201).json(new Apiresponse(201, populatedComment, "Comment created successfully"));
});

// Get all comments for a post
const getCommentsForPost = asynchandler(async (req, res) => {
    const postId = req.params.id;
    // console.log(postId)
    const comments = await Comment.find({ post: postId })
        .populate("createdBy")
        .populate("replies")
        .populate("mentions")
        .sort({ createdAt: -1 });

    if (!comments) {
        throw new Apierror(404, "Comments not found");
    }

    return res.status(200).json(new Apiresponse(200, comments, "Comments fetched successfully"));
});

// Get comment by ID
const getCommentById = asynchandler(async (req, res) => {
    const commentId = req.params.id;
    const comment = await Comment.findById(commentId)
        .populate("createdBy")
        .populate("replies")
        .populate("mentions");

    if (!comment) {
        throw new Apierror(404, "Comment not found");
    }

    return res.status(200).json(new Apiresponse(200, comment, "Comment fetched successfully"));
});

// Delete a comment
const deleteComment = asynchandler(async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
        throw new Apierror(404, "Comment not found");
    }

    // Remove comment from post
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });

    // Remove comment from parent comment replies
    if (comment.parentComment) {
        await Comment.findByIdAndUpdate(comment.parentComment, { $pull: { replies: commentId } });
    }

    return res.status(200).json(new Apiresponse(200, comment, "Comment deleted successfully"));
});

// Get comments by user
const getCommentsByUser = asynchandler(async (req, res) => {
    const { userId } = req.params;
    const comments = await Comment.find({ createdBy: userId })
        .populate("createdBy")
        .populate("replies")
        .populate("mentions")
        .sort({ createdAt: -1 });

    if (!comments) {
        throw new Apierror(404, "Comments not found");
    }

    return res.status(200).json(new Apiresponse(200, comments, "Comments fetched successfully"));
});

export {
    createComment,
    getCommentsForPost,
    getCommentById,
    deleteComment,
    getCommentsByUser
};
