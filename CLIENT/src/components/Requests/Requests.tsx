import React, { useEffect, useState } from "react";
import PostCard from "../Requestcard/Requestcard";
import axios from "axios";
import moment from "moment";
import { socket } from "../Socket";

interface Post {
  _id: string;
  media: string | null;
  content: string;
  createdBy: {
    username: string;
    avatar: string;
    onlineStatus: boolean;
    _id: string;
  };
  createdAt: string;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mycategoryposts, setMyCategoryPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [loadingCategoryPosts, setLoadingCategoryPosts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleNewPost = (data: Post) => {
      setPosts((prevPosts) => [data, ...prevPosts]);
    };

    socket.on("new-post", handleNewPost);

    return () => {
      socket.off("new-post", handleNewPost);
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://wish-me-65k8.onrender.com/api/v1/requests");
        setPosts(response.data.data);
      } catch (err) {
        setError("Failed to fetch posts");
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchMyCategoryPosts = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get("https://wish-me-65k8.onrender.com/api/v1/requests/myposts/myposts");
        setMyCategoryPosts(response.data.data);
      } catch (err) {
        setError("Failed to fetch category posts");
      } finally {
        setLoadingCategoryPosts(false);
      }
    };
    fetchMyCategoryPosts();
  }, []);

  return (
    <div className="p-4 w-full dark:bg-gray-950 h-full">
      {loadingCategoryPosts ? (
        <p>Loading recommended posts...</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">
            {mycategoryposts.length > 0 ? "Recommended For You" : "No recommended posts"}
          </h2>
          {mycategoryposts.length > 0 ? (
            mycategoryposts.map((post) => (
              <PostCard
                key={post._id}
                postId={post._id}
                avatar={post.createdBy?.avatar}
                creatorName={post.createdBy.username}
                content={post.content}
                mediaPreview={post.media}
                onlineStatus={post.createdBy?.onlineStatus}
                Buyerid={post.createdBy?._id}
                createdAt={moment(post.createdAt).fromNow()}
              />
            ))
          ) : (
            <p>No Recommendation right now</p>
          )}
        </>
      )}

      {loadingPosts ? (
        <p>Loading all posts...</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">All Requests</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                postId={post._id}
                avatar={post.createdBy?.avatar}
                creatorName={post.createdBy.username}
                content={post.content}
                mediaPreview={post.media}
                onlineStatus={post.createdBy?.onlineStatus}
                Buyerid={post.createdBy?._id}
                createdAt={moment(post.createdAt).fromNow()}
              />
            ))
          ) : (
            <p>No posts found</p>
          )}
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default HomePage;
