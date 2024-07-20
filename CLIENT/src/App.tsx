import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import MessagingInterface from "./components/Msginterface/Msginterface";
import ProfilePage from "./components/Profile/Profile";
import BuyerDashboard from "./components/BuyerDashboard/Bdashboard";
import SellerDashboard from "./components/SellerDashboard/Sdashboard";
import Createrequest from "./components/Requestposting/Requestposting";
import Login from "./components/Signin/Signin";
import HomePage from "./components/Requests/Requests";
import Signup from "./components/Signup/Signup";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from './components/Socket/index';
import { setOnlineuser } from "./components/Redux/Onlineuser";
import MyConversations from "./components/Msginterface/Myconversation";
import Theme from "./components/Theme/Theme";
import HowItWorks from "./components/Howitworks/Howitworks";
import About from "./components/About/About";
import SellerRoute from "./Routes/sellerroute";
import BuyerRoute from "./Routes/buyerroute";
import PrivateRoute from "./Routes/privateroute";
import ForgotPassword from "./components/Forgotpassword/Forgotpassword";
import ResetPassword from "./components/Resetpassword/Resetpassword";
import VerifyEmail from "./components/Verifyemail/Verifyemail";
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);

  useEffect(() => {
    // Emit 'online' event when user._id changes
    if (user?._id) {
      socket.emit('online', user._id);
    }
  }, [user]);

  useEffect(() => {
    // Listen for 'userList' event to update online user list
    const handleUserList = (users: any) => {
      dispatch(setOnlineuser(users));
    };

    socket.on('userList', handleUserList);

    return () => {
      socket.off('userList', handleUserList); // Clean up on unmount or dependency change
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Theme />
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/requests" element={<HomePage />} />
          <Route path="/post-request" element={<Createrequest />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagingInterface />} />
          <Route path="/my-conversations" element={<MyConversations />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        </Route>
        <Route element={<SellerRoute />}>
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
        </Route>
        <Route element={<BuyerRoute />}>
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        </Route>
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
