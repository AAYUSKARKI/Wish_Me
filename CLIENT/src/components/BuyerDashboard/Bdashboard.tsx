import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from "../Requestcard/Requestcard";
import moment from 'moment';
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
        .get("http://localhost:7000/api/v1/requests/myposts/myposts")
        .then((response) => {
          setPosts(response.data.data);
        });
    };
    getPosts();
  }, []);

  return (
    <div className="flex">
      <aside className="w-1/4 bg-gray-100 p-4">
        <ul>
          <li className="mb-2"><a href="#" className="text-blue-500">My Requests</a></li>
          <li className="mb-2"><Link to="/my-conversations">Responses</Link></li>
          <li className="mb-2"><Link to="/post-request">Post a Request</Link></li>
          <li className="mb-2"><Link to="/profile">Profile</Link></li>
          <li className="mb-2"><a href="#">Settings</a></li>
          <li className="mb-2">Logout</li>
        </ul>
      </aside>
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
