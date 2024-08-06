import MyConversations from "./Myconversation"
import Sidebar from "../Sidebar/Sidebar";

function Responses() {
  return (
    <>
     <div className="h-screen flex overflow-hidden">
      <Sidebar/>
      <MyConversations/>
     </div>
    </>
  )
}

export default Responses