import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { setuser } from "../Redux/Userslice";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    dispatch(setuser(null));
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-blue-500 dark:bg-slate-950 text-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-blue-300 transition-all duration-300"
        >
          WishMe
        </Link>
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? (
              <FaTimes className="h-6 w-6 text-white" />
            ) : (
              <FaBars className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
        <ul
          className={`fixed top-0 left-0 w-full h-screen bg-blue-500 dark:bg-slate-950 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:static md:flex md:items-center md:space-x-6 md:bg-transparent md:h-auto md:w-auto md:transform-none md:transition-none`}
        >
          <li className="md:hidden flex justify-end p-4">
            <button onClick={toggleMenu}>
              <FaTimes className="h-6 w-6 text-white" />
            </button>
          </li>
          <li className="p-4 md:p-0">
            <Link
              onClick={toggleMenu}
              to="/how-it-works"
              className="hover:text-blue-300 transition-colors duration-300"
            >
              How It Works
            </Link>
          </li>
          <li className="p-4 md:p-0">
            <Link
              onClick={toggleMenu}
              to="/about"
              className="hover:text-blue-300 transition-colors duration-300"
            >
              About
            </Link>
          </li>
          <li className="p-4 md:p-0">
            <a
              href="#features"
              className="hover:text-blue-300 transition-colors duration-300"
            >
              Service
            </a>
          </li>
          {!user && (
            <>
              <li className="p-4 md:p-0">
                <Link
                  onClick={toggleMenu}
                  className="block text-blue-500 px-6 py-2 rounded-full font-semibold text-center bg-white hover:bg-slate-200 transition-colors duration-300 shadow-md"
                  to="/login"
                >
                  Login
                </Link>
              </li>
              <li className="p-4 md:p-0">
                <Link
                  onClick={toggleMenu}
                  className="block bg-green-500 text-white hover:bg-green-600 px-6 py-2 rounded-full font-semibold text-center transition-colors duration-300 shadow-md"
                  to="/register"
                >
                  Signup
                </Link>
              </li>
            </>
          )}
          {user && user.role === "seller" && (
            <li className="p-4 md:p-0">
              <Link
                onClick={toggleMenu}
                to="/seller-dashboard"
                className="hover:text-blue-300 transition-colors duration-300"
              >
                Dashboard
              </Link>
            </li>
          )}
          {user && user.role === "buyer" && (
            <li className="p-4 md:p-0">
              <Link
                onClick={toggleMenu}
                to="/buyer-dashboard"
                className="hover:text-blue-300 transition-colors duration-300"
              >
                Dashboard
              </Link>
            </li>
          )}
          {user && user.role === "admin" && (
            <li className="p-4 md:p-0">
              <Link
                onClick={toggleMenu}
                to="/dashboard/admin"
                className="hover:text-blue-300 transition-colors duration-300"
              >
                Dashboard
              </Link>
            </li>
          )}
          {user && (
            <li className="p-4 md:p-0">
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="bg-red-500 text-white hover:bg-red-600 px-6 py-2 rounded-full font-semibold text-center transition-colors duration-300 shadow-md"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
