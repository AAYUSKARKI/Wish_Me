import { BrowserRouter,Route,Routes } from "react-router-dom"
import Landingpage from "./pages/Landingpage"
import MessagingInterface from "./components/Msginterface/Msginterface"
import ProfilePage from "./components/Profile/Profile"
import RequestListingPage from "./components/Requestlisting/Requestlisting"
import RequestPostingPage from "./components/Requestposting/Requestposting"
import SignUpForm from "./components/Signup/Signup"
import SignInForm from "./components/Signin/Signin"
import BuyerDashboard from "./components/BuyerDashboard/Bdashboard"
import SellerDashboard from "./components/SellerDashboard/Sdashboard"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Landingpage/>}/>
        <Route path="/signup" element={<SignUpForm/>} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/post-request" element={<RequestPostingPage />} />
        <Route path="/requests" element={<RequestListingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/messages" element={<MessagingInterface />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App