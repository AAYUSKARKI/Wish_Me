import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaHome, FaComments, FaBell, FaUser, FaCog, FaSignOutAlt, FaPlus, FaBars, FaTimes, FaEllipsisV } from 'react-icons/fa';
import { setuser } from '../Redux/Userslice'; // Adjust the import path as necessary

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBottom, setIsBottom] = useState(false); // State to toggle top/bottom position
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate hook for navigation

  const menus = [
    {
      title: user.role === 'buyer' ? 'My Requests' : 'Browse Requests',
      link: user.role === 'buyer' ? '/my-requests' : '/browse-requests',
      icon: FaHome,
    },
    {
      title: 'Conversations',
      link: '/my-conversations',
      icon: FaComments,
    },
    {
      title: user.role === 'buyer' ? 'Post a Request' : '',
      link: user.role === 'buyer' ? '/post-request' : '',
      icon: user.role === 'buyer' ? FaPlus : null,
    },
    {
      title: 'Notifications',
      link: '/notifications',
      icon: FaBell,
    },
    {
      title: 'Profile',
      link: '/profile',
      icon: FaUser,
    },
    {
      title: 'Settings',
      link: '/settings',
      icon: FaCog,
    },
    {
      title: 'Logout',
      link: '',
      icon: FaSignOutAlt,
      action: () => dispatch(setuser(null)),
    },
  ];

  const handleMenuClick = (action?: () => void, link?: string) => {
    if (action) {
      action();
    }
    if (link) {
      navigate(link); // Use navigate for programmatic navigation
    }
  };

  return (
    <div className="relative z-50">
      <button
        className="md:hidden p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <aside
        className={`fixed ${isBottom ? 'bottom-0' : 'top-0'} left-0 right-0 bg-gray-100 dark:bg-gray-950 dark:text-white text-black p-4 transition-all duration-300 ${isOpen ? 'block' : 'hidden md:flex'}`}
      >
        <ul className={`flex flex-row justify-around md:text-xl  w-full ${isOpen ? 'space-x-6' : 'space-x-4'} ${!isOpen && 'lg:space-x-12'}`}>
          {menus.map((menu, index) => (
            <li key={index} className="group relative flex flex-col items-center">
              {menu.icon && (
                <menu.icon
                  className="text-xl cursor-pointer"
                  onClick={() => handleMenuClick(menu.action, menu.link)}
                />
              )}
              {menu.link ? (
                <Link 
                  to={menu.link} 
                  className={`hidden group-hover:block absolute top-full left-1/2 md:left-auto transform -translate-x-1/2 bg-gray-800 text-white rounded-md px-2 py-1 md:bg-transparent md:text-black dark:md:text-white md:px-0 md:py-0  md:ml-3 ${!isOpen && 'hidden'}`}
                >
                  {menu.title}
                </Link>
              ) : (
                menu.title && (
                  <button
                    className={`hidden group-hover:block absolute top-full left-1/2 md:left-auto transform -translate-x-1/2 bg-gray-800 text-white rounded-md px-2 py-1 md:bg-transparent md:text-black dark:md:text-white md:px-0 md:py-0 md:ml-3 ${!isOpen && 'hidden'}`}
                    onClick={() => handleMenuClick(menu.action, menu.link)}
                  >
                    {menu.title}
                  </button>
                )
              )}
            </li>
          ))}
          <li className="group relative flex flex-col items-center">
            <FaEllipsisV className="text-xl cursor-pointer" onClick={() => setIsBottom(!isBottom)} />
            <span className="hidden group-hover:block absolute top-full left-1/2 md:left-auto transform -translate-x-1/2 bg-gray-800 text-white rounded-md px-2 py-1 md:bg-transparent md:text-black dark:md:text-white md:px-0 md:py-0  md:ml-3">
              Toggle Position
            </span>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
