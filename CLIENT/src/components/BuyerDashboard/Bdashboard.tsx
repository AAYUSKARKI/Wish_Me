import { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from "../Requestcard/Requestcard";
import moment from 'moment';
import Sidebar from '../Sidebar/Sidebar';
interface Post {
  _id: string;
  media: string | null;
  content: string;
  createdBy: {
    username: string;
    avatar: string;
    onlineStatus: boolean; // Add onlineStatus
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
        .get("https://wish-me-65k8.onrender.com/api/v1/requests/myposts/myposts")
        .then((response) => {
          setPosts(response.data.data);
        });
    };
    getPosts();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar/>
      <main className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Current Requests</h2>
        <div className="p-4">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            avatar={post.createdBy?.avatar}
            creatorName={post.createdBy.username}
            content={post.content}
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
      </main>
    </div>
  );
};

export default BuyerDashboard;
