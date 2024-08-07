import React, { useState } from "react";
import { IoHeartOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import Chatcard from "../Respondchat/Chatcard";
import CommentSection from "../Comment/Comment";

interface PostCardProps {
  avatar: string;
  creatorName: string;
  content: string;
  mediaPreview?: string | null;
  createdAt: string;
  onlineStatus: boolean;
  lastOnline: string;
  Buyerid: string;
  postId: string;
}

const PostCard: React.FC<PostCardProps> = ({
  avatar,
  creatorName,
  content,
  mediaPreview,
  createdAt,
  Buyerid,
  lastOnline,
  postId,
}) => {
  const { user } = useSelector((state: any) => state.user);
  const [popup, setPopup] = useState<boolean>(false);
  const { onlineuser } = useSelector((state: any) => state.onlineuser);
  console.log(onlineuser)
  const isOnline = onlineuser.some((user: any) => user._id === Buyerid);

  const handleClick = () => {
    setPopup(true);
  };

  const handleCloseChat = () => {
    setPopup(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 dark:text-white p-4 rounded-lg shadow-lg mb-4 relative max-w-full md:max-w-lg lg:max-w-2xl mx-auto">
        {popup && (
          <div className="absolute inset-0 z-10">
            <Chatcard
              creatorAvatar={avatar}
              popup={popup}
              Buyerid={Buyerid}
              lastOnline={lastOnline}
              creatorName={creatorName}
              closeChat={handleCloseChat}
            />
          </div>
        )}
        <div className="flex items-center mb-4">
          <div className="relative">
            <img
              src={avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover mr-2"
            />
            <div
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="text-lg font-semibold">{creatorName}</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                {createdAt}
              </span>
            </div>
          </div>
          {user?.role === "seller" && (
            <button
              onClick={handleClick}
              className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 focus:outline-none"
            >
              Respond
            </button>
          )}
        </div>
        <p className="text-gray-800 mb-4 dark:text-gray-200">{content}</p>
        {mediaPreview && (
          <div className="relative mb-4">
            <img
              src={mediaPreview}
              alt="Post Media"
              className="w-full h-auto object-cover rounded-lg shadow-xl lg:h-[400px]"
            />
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t border-gray-300 dark:border-gray-700">
          <button className=" flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500 focus:outline-none">
            <IoHeartOutline className="text-2xl mr-1" />
            Like
          </button>
          <CommentSection postId={postId} />
        </div>
      </div>
    </>
  );
};

export default PostCard;
