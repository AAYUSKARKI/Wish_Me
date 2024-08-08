import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { socket } from "../Socket";
import { IoChatboxOutline, IoArrowRedoOutline, IoTrashOutline } from "react-icons/io5";
import toast from "react-hot-toast";

interface Comment {
  _id: string;
  parentComment?: string;
  text: string;
  createdBy: {
    username: string;
    avatar: string;
  };
  createdAt: string;
  replies: Comment[];
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useSelector((state: any) => state.user);
  const [showCommentInput, setShowCommentInput] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:7000/api/v1/comments/${postId}`);
        setComments(response.data.data);
        setTotalComments(response.data.data.length);
      } catch (error) {
        toast.error("Error fetching comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  useEffect(() => {
    socket.on("new-comment", (comment: Comment) => {
      setComments((prevComments) => [comment, ...prevComments]);
      setTotalComments((prevCount) => prevCount + 1);
    });

    socket.on("new-reply", (reply: Comment) => {
      setComments((prevComments) => {
        const updatedComments = prevComments.map((comment) => {
          if (comment._id === reply.parentComment) {
            return { ...comment, replies: [reply, ...comment.replies] };
          }
          return comment;
        });
        return updatedComments;
      });
      setTotalComments((prevCount) => prevCount + 1);
    });

    socket.on("deleteComment", (commentId: string) => {
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
      setTotalComments((prevCount) => prevCount - 1);
    });

    return () => {
      socket.off("new-comment");
      socket.off("new-reply");
      socket.off("deleteComment");
    };
  }, [postId]);

  const handleCommentClick = () => {
    setShowCommentInput((prev) => !prev);
  };

  const handleCommentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post("http://localhost:7000/api/v1/comments", {
        text: comment,
        postId,
        createdBy: user._id,
      });

      toast.success(response.data.message);
      socket.emit("newComment", response.data.data);
      setComment("");
      setShowCommentInput(false);
    } catch (error) {
      toast.error("Error submitting comment.");
    }
  };

  const handleReplyChange = (commentId: string, e: ChangeEvent<HTMLInputElement>) => {
    setReplyInput((prev) => ({ ...prev, [commentId]: e.target.value }));
  };

  const handleReplySubmit = async (commentId: string, e: FormEvent) => {
    e.preventDefault();
    const replyText = replyInput[commentId];
    if (!replyText.trim()) return;

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post("http://localhost:7000/api/v1/comments", {
        text: replyText,
        postId,
        createdBy: user._id,
        parentComment: commentId,
      });

      toast.success(response.data.message);
      socket.emit("newReply", response.data.data);
      setReplyInput((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplies((prev) => ({ ...prev, [commentId]: false }));
    } catch (error) {
      toast.error("Error submitting reply.");
    }
  };

  const handleShowReplies = (commentId: string) => {
    setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`http://localhost:7000/api/v1/comments/${commentId}`);
      socket.emit("deleteComment", commentId);
    } catch (error) {
      toast.error("Error deleting comment.");
    }
  };

  const renderComments = (comments: Comment[], level: number = 0) => {
  return comments.map((comment) => (
    <div key={comment._id} className={`ml-${level * 4} mt-2`}>
      <div className="flex items-start">
        <img
          src={comment.createdBy.avatar}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover mr-2"
        />
        <div className="flex-1 p-2 bg-gray-100 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <span className="font-semibold">{comment.createdBy.username}</span>
              <p className="text-sm mt-1">{comment.text}</p>
            </div>
            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <div className="mt-2 flex space-x-2">
            <button
              onClick={() => handleShowReplies(comment._id)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 focus:outline-none"
            >
              <IoArrowRedoOutline className="text-xl" />
            </button>
            <button
              onClick={() => handleDeleteComment(comment._id)}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 focus:outline-none"
            >
              <IoTrashOutline className="text-xl" />
            </button>
          </div>
          {showReplies[comment._id] && (
            <>
              {comment.replies.length > 0 && (
                <div className="mt-2 border-t border-gray-300 pt-2">
                  {renderComments(comment.replies, level + 1)}
                </div>
              )}
              <form onSubmit={(e) => handleReplySubmit(comment._id, e)} className="mt-2">
                <input
                  type="text"
                  value={replyInput[comment._id] || ""}
                  onChange={(e) => handleReplyChange(comment._id, e)}
                  placeholder="Write a reply..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 focus:outline-none"
                >
                  Reply
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  ));
};


  if (loading) {
    return <p>Loading comments...</p>;
  }

  return (
    <div className="mt-4">
      <p className="text-gray-600 dark:text-gray-300">
        Total Comments: {totalComments}
      </p>
      <button
        onClick={handleCommentClick}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 focus:outline-none mt-2"
      >
        <IoChatboxOutline className="text-2xl mr-1" />
        Comment
      </button>
      {showCommentInput && (
        <>
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Write a comment..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 focus:outline-none"
            >
              Submit
            </button>
          </form>
          {comments.length > 0 && (
            <div className="mt-4">
              {renderComments(comments)}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
