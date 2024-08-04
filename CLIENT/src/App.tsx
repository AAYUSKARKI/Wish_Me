import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landingpage from "./pages/Landingpage";
import MessagingInterface from "./components/Msginterface/Msginterface";
import ProfilePage from "./components/Profile/Profile";
import BuyerDashboard from "./components/BuyerDashboard/Bdashboard";
import SellerDashboard from "./components/SellerDashboard/Sdashboard";
import Createrequest from "./components/Requestposting/Requestposting";
import Login from "./components/Signin/Signin";
import HomePage from "./components/Requests/Requests";
import CookiePolicy from "./components/Cookieppolicy/Cookiepolicy";
import Signup from "./components/Signup/Signup";
import { Suspense, lazy, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from './components/Socket/index';
import { setOnlineuser } from "./components/Redux/Onlineuser";
import Theme from "./components/Theme/Theme";
import Loader from "./components/Loader/Loader";
import Cookieinfo from './components/Cookieinfo/Cookieinfo'; // Import the Cookieinfo component
import TermsOfService from "./pages/Termsofservice";
import PrivacyPolicy from "./pages/Privacypolicy";
import Responses from "./components/Msginterface/Responses";

// Lazy load components
const VerifyEmail = lazy(() => import('./components/Verifyemail/Verifyemail'));
const ForgotPassword = lazy(() => import('./components/Forgotpassword/Forgotpassword'));
// const MyConversations =lazy(()=> import("./components/Msginterface/Myconversation"));
const ResetPassword = lazy(() => import('./components/Resetpassword/Resetpassword'));
const HowItWorks = lazy(() => import('./components/Howitworks/Howitworks'));
const About = lazy(() => import('./components/About/About'));
const SellerRoute = lazy(() => import('./Routes/sellerroute'));
const BuyerRoute = lazy(() => import('./Routes/buyerroute'));
const PrivateRoute = lazy(() => import('./Routes/privateroute'));
const ResendVerification = lazy(()=> import('./pages/Resendverify'))
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?._id) {
      socket.emit('online', user._id);
    }
  }, [user]);

  useEffect(() => {
    const handleUserList = (users: any) => {
      dispatch(setOnlineuser(users));
    };

    socket.on('userList', handleUserList);

    return () => {
      socket.off('userList', handleUserList);
    };
  }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Reduced duration
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Theme />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/responses" element={<Responses />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/termsofservice" element={<TermsOfService />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/cookiepolicy" element={<CookiePolicy/>}/>
          <Route element={<PrivateRoute />}>
            <Route path="/requests" element={<HomePage />} />
            <Route path="/post-request" element={<Createrequest />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagingInterface />} />
            <Route path="/my-conversations" element={<Responses />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
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
      </Suspense>
      <Cookieinfo /> {/* Add the Cookieinfo component here */}
    </BrowserRouter>
  );
}

export default App;
