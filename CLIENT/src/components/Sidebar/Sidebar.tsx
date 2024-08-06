import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaHome, FaComments, FaBell, FaUser, FaCog, FaSignOutAlt, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { setuser } from '../Redux/Userslice'; // Adjust the import path as necessary

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

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
      window.location.href = link;
    }
  };

  return (
    <aside className={`bg-gray-100 dark:bg-gray-950 dark:text-white text-black h-screen p-4 relative duration-300 ${isOpen ? 'w-72' : 'w-20'}`}>
      <button
        className="absolute top-8 -right-3 w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
      <ul>
        {menus.map((menu, index) => (
          <li key={index} className="mb-2 flex items-center">
            {menu.icon && (
              <menu.icon className="mr-3 cursor-pointer" onClick={() => handleMenuClick(menu.action, menu.link)} />
            )}
            {menu.link ? (
              <Link to={menu.link} className={`text-blue-500 ${!isOpen && 'hidden md:block sm:block'}`}>
                <span className={`${isOpen ? 'block' : 'hidden'} sm:inline`}>{menu.title}</span>
              </Link>
            ) : (
              menu.title && (
                <button className={`text-blue-500 ${!isOpen && 'hidden md:block sm:block'}`} onClick={() => handleMenuClick(menu.action, menu.link)}>
                  <span className={`${isOpen ? 'block' : 'hidden'} sm:inline`}>{menu.title}</span>
                </button>
              )
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
