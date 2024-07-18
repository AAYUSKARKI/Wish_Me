import React,{useState} from "react";
import { IoHeartOutline, IoChatboxOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import Chatcard from "../Respondchat/Chatcard";

interface PostCardProps {
  avatar: string; // URL of the avatar image
  creatorName: string;
  content: string;
  mediaPreview?: string | null; // URL of the media preview image (optional)
  createdAt: string;
  onlineStatus: boolean;
  Buyerid: string;
}

const PostCard: React.FC<PostCardProps> = ({
  avatar,
  creatorName,
  content,
  mediaPreview,
  createdAt,
  onlineStatus,
  Buyerid
}) => {
  const { user } = useSelector((state: any) => state.user);
  const [popup,setPopup] = useState<boolean>(false)
  const {onlineuser} = useSelector((state: any) => state.onlineuser);
//   console.log(onlineuser,'is the online user');
  const isOnline = onlineuser.some((user:any)=>user._id === Buyerid);
//   console.log(isOnline,'is online')

  const handleClick = ()=>{
    setPopup(true)
    console.log("Respond button clicked");
  }
  const handleCloseChat = () => {
    setPopup(false);
  };
  return (
    <>
    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
    <div className="bg-white rounded-lg shadow-lg relative z-10">
      {popup && <Chatcard creatorAvatar={avatar} popup={popup} Buyerid={Buyerid} creatorName={creatorName} closeChat={handleCloseChat} />}
      </div>
      {/* Avatar and creator name */}
      <div className="flex items-center mb-4">
        {/* Avatar */}
        <div className="relative">
          <div
            className={`absolute -top-3 -right-3 ${isOnline ? "bg-green-500" : "bg-red-500"} h-2 w-2 text-white text-xs px-2 py-1 rounded-full`}
          ></div>
          <img
            src={avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full object-cover mr-2"
          />
        </div>
        <span className="text-lg font-semibold">{creatorName}</span>
        {/* Date and time */}
        <span className="text-gray-600 ml-2">
          {createdAt}
        </span>
        {user?.role === 'seller' && <button onClick={handleClick} className="ml-auto rounded-2xl shadow-2xl text-center hover:text-black focus:outline-none cursor-pointer hover:underline bg-green-600 text-white px-4 py-2">Respond</button>}
      </div>
      
      {/* Content */}
      <p className="text-gray-800 mb-4">{content}</p>

      {/* Media preview (if present) */}
      {mediaPreview && (
        <div className="relative mb-4">
          <img
            src={mediaPreview}
            alt="Post Media"
            className="w-48 h-48 object-cover rounded-lg shadow-xl"
          />
        </div>
      )}

      {/* Like and comment buttons */}
      <div className="flex justify-between items-center">
        <button className="flex items-center text-gray-600 hover:text-blue-500 focus:outline-none">
          <IoHeartOutline className="text-xl mr-1" />
          Like
        </button>
        <button className="flex items-center text-gray-600 hover:text-blue-500 focus:outline-none">
          <IoChatboxOutline className="text-xl mr-1" />
          Comment
        </button>
      </div>
    </div>
    </>
  );
};

export default PostCard;