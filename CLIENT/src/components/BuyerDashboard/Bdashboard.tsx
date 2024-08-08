import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from "../Requestcard/Requestcard";
import moment from 'moment';
import Sidebar from '../Sidebar/Sidebar';
import HomePage from '../Requests/Requests';

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

const BuyerDashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      axios.defaults.withCredentials = true;
      try {
        const response = await axios.get("https://wish-me-65k8.onrender.com/api/v1/requests/posts/requests/myposts");
        setPosts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    getPosts();
  }, []);

  return (
    <div className="h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 dark:bg-gray-950 overflow-y-auto p-4">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">My Requests</h2>
        <div className="mb-8">
          {posts && posts.length > 0 ? (
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
        </div>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">ALL Available Requests</h2>
        <HomePage />
      </main>
    </div>
  );
};

export default BuyerDashboard;
