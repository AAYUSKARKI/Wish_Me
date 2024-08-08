import MyConversations from "./Myconversation"
import Sidebar from "../Sidebar/Sidebar";

function Responses() {
  return (
    <>
     <div className="h-screen w-full dark:bg-gray-950">
      <Sidebar/>
      <MyConversations/>
     </div>
    </>
  )
}

export default Responses