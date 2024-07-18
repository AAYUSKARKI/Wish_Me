
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { setuser } from "../Redux/Userslice";

const Navbar = () => {
  const { user } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    dispatch(setuser(null));
  };

  return (
    <div className="bg-blue-500 text-white shadow-md">
      <nav className="flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold cursor-pointer hover:text-3xl">WishMe</Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/how-it-works">How It Works</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <a href="#features">Service</a>
          </li>
          {!user && (
            <>
              <li>
                <Link className=" text-blue-500 px-6 py-2 rounded-full font-semibold tsxt-center bg-slate-200" to="/login">
                  Login
                </Link>
              </li>
              <li>
                <Link className="bg-green-500 text-white hover:bg-blue-500 px-6 py-2 rounded-full font-semibold text-center" to="/register">
                  Signup
                </Link>
              </li>
            </>
          )}
          {
            user && user.role==="seller" && (
              <li>
                <Link to="/seller-dashboard">Dashboard</Link>
              </li>
            )
          }
          {
            user && user.role==="buyer" && (
              <li>
                <Link to="/buyer-dashboard">Dashboard</Link>
              </li>
            )
          }
          {
            user && user.role==="admin" && (
              <li>
                <Link to="/dashboard/admin">Dashboard</Link>
              </li>
            )
          }
          {user && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
