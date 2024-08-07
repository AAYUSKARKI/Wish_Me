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
    onlineStatus: boolean; // Add onlineStatus
    lastOnline: string;
    _id:string;
  };
  createdAt: string;
}

const BuyerDashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      axios.defaults.withCredentials = true;
      await axios
        .get("https://wish-me-65k8.onrender.com/api/v1/requests/posts/requests/myposts")
        .then((response) => {
          setPosts(response.data.data);
        });
    };
    getPosts();
  }, []);

  return (
    <div className="flex w-full h-screen overflow-auto">
      <Sidebar/>
      <main className="h-screen flex flex-col dark:bg-gray-950 w-full">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">My Requests</h2>
        <div className="h-screen p-4 overflow-y-auto flex-grow">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            postId={post._id}
            avatar={post.createdBy?.avatar}
            creatorName={post.createdBy.username}
            content={post.content}
            lastOnline={moment(post.createdBy?.lastOnline).fromNow()}
            mediaPreview={post.media}
            onlineStatus={post.createdBy?.onlineStatus}
            Buyerid={post.createdBy?._id}
            createdAt={moment(post.createdAt).fromNow()} // Formatting createdAt to a human-readable time
          />
        ))
      ) : (
        <p>No posts found</p>
      )}
    </div>
    <h2 className="text-2xl font-bold mb-4">ALL Available Requests</h2>
          <HomePage />
      </main>
    </div>
  );
};

export default BuyerDashboard;
