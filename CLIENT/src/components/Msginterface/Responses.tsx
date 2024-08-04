import MyConversations from "./Myconversation"
import Sidebar from "../Sidebar/Sidebar";

function Responses() {
  return (
    <>
     <div className="flex">
      <Sidebar/>
      <MyConversations/>
     </div>
    </>
  )
}

export default Responses